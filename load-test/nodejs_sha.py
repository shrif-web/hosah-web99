import time
import random
from locust import HttpUser, task
from locust.user.wait_time import between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def index_page(self):
        self.client.post(
            'nodejs/sha256',
            json={'num1': random.randint(0, 5), 'num2': random.randint(10, 1000)},
        )