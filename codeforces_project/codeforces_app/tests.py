from django.test import Client

# Create your tests here.

def test_page_load(self):
    c = Client()
    response = c.get("/show/")
    self.assertEqual(response.status_code,200)
    