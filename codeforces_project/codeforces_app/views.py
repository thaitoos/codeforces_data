from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
from codeforces_app.models import Contestant, Data
from django.contrib.admin.views.decorators import staff_member_required
import json
from django import forms

class RatingForm(forms.Form):
    rating = forms.IntegerField(min_value=-100,max_value=4000, initial=1500)
class HandleForm(forms.Form):
    username = forms.CharField(max_length=128, widget=forms.TextInput(attrs={'placeholder': 'Your username'}))
# Create your views here.

def get_contestant_place(rating:int, size: int):#returns number of cotestant with a lower or equal rating
    #if rating < -100 or rating > 4500:
    #    return -1
    size = int(size)
    l = int(1)
    r = int(size)
    while(l<r):
        m = int((l+r)//2)
        previous_m = m
        m = size + 1 - m # best contestant has index 1 
        m_rating = Contestant.objects.get(index = m).rating
        if m_rating > rating:# counts other contestants with the same rating as worse
            r=previous_m
        else:
            l=previous_m+1
    if l == size and Contestant.objects.get(index = 1).rating <= rating:
        return l
    return l-1


def profile_info(request):
    if request.method == 'POST':
        if "submit-handle" in request.POST:
            form = HandleForm(request.POST)
            if form.is_valid():
                handle = form.cleaned_data['username']
                handle = handle.lower()
                if not Contestant.objects.filter(handle = handle).exists():
                    rating_form = RatingForm()
                    handle_form = HandleForm()
                    return render(request, "codeforces_app/profile_info.html", {
                        'rating_form' : rating_form,
                        'handle_form': handle_form,
                        'load_type': 'error',
                        'message': 'invalid username(new or inactive accounts may be unavailable)',
                    })
                contestant = Contestant.objects.get(handle = handle)
                size = int(Data.objects.get(name = 'size').value)
                average = float(Data.objects.get(name = 'average').value)
                contestants_worse = size - contestant.index
                percent_worse = round(contestants_worse*100/size,2)
                distance_to_average = abs(contestant.rating - average)
                distance_to_average = round(distance_to_average,2)# rounding behaves weirdly
                above = contestant.rating > average
                rating_form = RatingForm()
                handle_form = HandleForm()
                username = contestant.handle_with_case
                return render(request, "codeforces_app/profile_info.html", {
                    'rating_form' : rating_form,
                    'handle_form': handle_form,
                    'load_type': 'handle',
                    'percent_worse': percent_worse,
                    'contestants_worse': contestants_worse,
                    'distance_to_average': distance_to_average,
                    'above': above,
                    'rating': contestant.rating,
                    'username': username,
                })
            else:
                rating_form = RatingForm()
                handle_form = HandleForm()
                return render(request, "codeforces_app/profile_info.html", {
                    'rating_form' : rating_form,
                    'handle_form': handle_form,
                    'load_type': 'error',
                    'message': 'form wasnt valid',
                })
        if 'submit-rating' in request.POST:
            form = RatingForm(request.POST)
            if form.is_valid():
                rating = form.cleaned_data['rating']
                rating = int(rating)
                if rating < -200 or rating > 4500:
                    rating_form = RatingForm()
                    handle_form = HandleForm()
                    return render(request, "codeforces_app/profile_info.html", {
                        'rating_form' : rating_form,
                        'handle_form': handle_form,
                        'load_type': 'error',
                        'message': 'invalid username(new or inactive accounts may be unavailable)',
                    })
                size = int(Data.objects.get(name = 'size').value)
                average = float(Data.objects.get(name = 'average').value)
                contestants_worse =  size - get_contestant_place(rating,size) #get_contestant_place(rating, size)
                percent_worse = round(contestants_worse*100/size,2)
                distance_to_average = abs(rating - average)
                distance_to_average = round(distance_to_average,2)# rounding behaves weirdly
                above = rating > average
                rating_form = RatingForm()
                handle_form = HandleForm()
                return render(request, "codeforces_app/profile_info.html", {
                    'rating_form' : rating_form,
                    'handle_form': handle_form,
                    'load_type': 'rating',
                    'percent_worse': percent_worse,
                    'contestants_worse': contestants_worse,
                    'distance_to_average': distance_to_average,
                    'above': above,
                    'rating': rating,
                })
            else:
                rating_form = RatingForm()
                handle_form = HandleForm()
                return render(request, "codeforces_app/profile_info.html", {
                    'rating_form' : rating_form,
                    'handle_form': handle_form,
                    'load_type': 'error',
                    'message': 'form wasnt valid',
                })    

    rating_form = RatingForm()
    handle_form = HandleForm()
    return render(request, "codeforces_app/profile_info.html", {
        'rating_form' : rating_form,
        'handle_form': handle_form,
    })


#@staff_member_required
def get_stats(request):
    data = requests.get('https://codeforces.com/api/user.ratedList?activeOnly=false&includeRetired=true')
    if(data.status_code!=200):
        return
    data = data.json() # its already a json file ????
    Contestant.objects.all().delete()
    #objs = Contestant.objects.bulk_create([Contestant(rating = int(user['rating']), handle = user['handle']) for user in data['result']])
    contestant_list = []
    ctr = 0
    sum = 0
    ind = 1
    for user in data['result']:
        contestant_list+=[Contestant(rating = int(user['rating']), handle = user['handle'].lower(),handle_with_case = user['handle'], index = ind)]
        ctr+=1
        sum+=user['rating']
        ind+=1
    ind-=1
    objs = Contestant.objects.bulk_create(contestant_list)
    sorted_contestants = Contestant.objects.all().order_by('rating')
    percentiles = {}
    num_of_contestants = Contestant.objects.all().count()
    for i in range(1,100):
        place = int(i/100*num_of_contestants)
        place = max(place,0)
        place = min(place, ctr-1)
        ith_percentile_rating = sorted_contestants[place].rating
        percentiles[i] = ith_percentile_rating
    print(percentiles)
    Data.objects.all().delete()
    data_obj = Data(name = 'percentiles', value = json.dumps(percentiles))
    data_obj.save()
    data_obj = Data(name = 'size', value = str(ctr))
    data_obj.save()
    data_obj = Data(name = 'average', value = str(sum/ctr))
    data_obj.save()
def show(request):
    json_percentiles = Data.objects.get(name='percentiles').value
    json_percentiles = json.loads(json_percentiles)
    return render(request, 'codeforces_app/show.html', {
        'json_percentiles' : json_percentiles,
        'average' : Data.objects.get(name = 'average').value
    })
def index(request):
    return profile_info(request)
