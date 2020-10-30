import random
from locust import HttpUser, task
from locust.user.wait_time import between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def index_page(self):
        self.client.get(f'nodejs/write?lineno={random.randint(1, 100)}')