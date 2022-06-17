from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
from codeforces_app.models import Contestant, Data
from django.contrib.admin.views.decorators import staff_member_required
import json
# Create your views here.
def index(request):
    return render(request, "codeforces_app/index.html")
    #return HttpResponse('yo')
#@staff_member_required
def get_contestant_place(rating, size):#returns number of cotestant with a lower rating
    if rating < -100 or rating > 4500:
        return -1
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
    return l-1

def get_stats(request):
    data = requests.get('https://codeforces.com/api/user.ratedList')
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
        contestant_list+=[Contestant(rating = int(user['rating']), handle = user['handle'], index = ind)]
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
        'json_percentiles' : json_percentiles
    })

