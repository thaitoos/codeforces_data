from django.test import Client
from django.test import TestCase
#from views import get_contestant_place
from .views import get_contestant_place
from .models import Contestant
# Create your tests here.

class Tests(TestCase):
    def test_page_load(self):
        c = Client()
        #response = c.get('/codeforces_app/show')
        response = c.get('/codeforces_app/')
        self.assertEqual(response.status_code,200)
    def test_get_contestant_place(self):
        cont = Contestant(rating = 3000, handle = "a", index = 1)
        cont.save()
        cont = Contestant(rating = 2900, handle = "a", index = 2)
        cont.save()
        cont = Contestant(rating = 2900, handle = "a", index = 3)
        cont.save()
        cont = Contestant(rating = 1000, handle = "a", index = 4)
        cont.save()
        cont = Contestant(rating = 900, handle = "a", index = 5)
        cont.save()
        cont = Contestant(rating = -10, handle = "a", index = 6)
        cont.save()
        self.assertEqual(get_contestant_place(-20,6),0)
        self.assertEqual(get_contestant_place(100,6),1)
        self.assertEqual(get_contestant_place(899,6),1)
        self.assertEqual(get_contestant_place(900,6),2)
        self.assertEqual(get_contestant_place(901,6),2)
        self.assertEqual(get_contestant_place(1500,6),3)
        self.assertEqual(get_contestant_place(2899,6),3)
        self.assertEqual(get_contestant_place(2900,6),5)
        self.assertEqual(get_contestant_place(3000,6),6)
        self.assertEqual(get_contestant_place(4000,6),6)

