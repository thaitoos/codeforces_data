from django.db import models

# Create your models here.

class Contestant(models.Model):
    rating = models.IntegerField()
    handle = models.CharField(max_length=256, unique=True)
    handle_with_case = models.CharField(max_length=256, unique=True,blank=True, null=True)
    index = models.IntegerField(unique=True, blank = True, null= True)
    def get_top_percent(self):
        for i in range(19):
            print(self.objects.get(index = 2))
        return self.objects.get(index = 2)

class Data(models.Model):
    name = models.CharField(max_length=1024,unique=True)
    value = models.CharField(max_length=1000000)
