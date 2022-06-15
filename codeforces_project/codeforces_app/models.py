from django.db import models

# Create your models here.

class Contestant(models.Model):
    rating = models.IntegerField()
    handle = models.CharField(max_length=256)
class Data(models.Model):
    name = models.CharField(max_length=1024)
    value = models.CharField(max_length=1000000)
