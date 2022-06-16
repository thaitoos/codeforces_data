from django.test import Client
from django.test import TestCase
# Create your tests here.

class Tests(TestCase):
    def test_page_load(self):
        c = Client()
        response = c.get('/codeforces_app/show')
        self.assertEqual(response.status_code,200)
    