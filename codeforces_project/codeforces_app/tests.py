from multiprocessing.connection import Client
from django.test import TestCase

# Create your tests here.

def test_page_load(self):
    c = Client()
    response = c.get("/show/")
    self.assertEqual(response.status_code,200)
    