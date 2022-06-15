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
def get_stats(request):
    data = requests.get('https://codeforces.com/api/user.ratedList')
    if(data.status_code!=200):
        return
    data = data.json() # its already a json file ????
    ctr = 0
    sum = 0
    for user in data['result']:
        ctr+=1
        sum+=user['rating']
    Contestant.objects.all().delete()
    objs = Contestant.objects.bulk_create([Contestant(rating = int(user['rating']), handle = user['handle']) for user in data['result']])
    sorted_contestants = Contestant.objects.all().order_by('rating')
    percentiles = {}
    num_of_contestants = Contestant.objects.all().count()
    for i in range(1,100):
        place = int(i/100*num_of_contestants)
        ith_percentile_rating = sorted_contestants[place].rating
        percentiles[i] = ith_percentile_rating
    print(percentiles)
    Data.objects.all().delete()
    data_obj = Data(name = 'percentiles', value = json.dumps(percentiles))
    data_obj.save()
def show(request):
    json_percentiles = Data.objects.get(name='percentiles').value
    json_percentiles = json.loads(json_percentiles)
    return render(request, 'codeforces_app/show.html', {
        'json_percentiles' : json_percentiles
    })

