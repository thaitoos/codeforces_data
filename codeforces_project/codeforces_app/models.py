from enum import unique
from django.db import models

# Create your models here.

class Contestant(models.Model):
    rating = models.IntegerField()
    handle = models.CharField(max_length=256)
    index = models.IntegerField(unique=True, blank = True, null= True)

class Data(models.Model):
    name = models.CharField(max_length=1024)
    value = models.CharField(max_length=1000000)
