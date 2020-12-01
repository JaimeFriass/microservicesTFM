import requests
import time
import os
from redis import Redis

redis_params = {
    'host': os.environ.get('REDIS_HOST', 'localhost'),
    'port': int(os.environ.get('REDIS_PORT', 6379)),
    'db': int(os.environ.get('REDIS_DB', 0)),
    'decode_responses': True
}

r = Redis(**redis_params)

def send_qa(value):
    r.publish('airquality', int(value))

while True:

    request = requests.get('https://api.waqi.info/feed/here/?token=a2896c91ce70d4a73838e8ae95d2b2baa00c0727')

    request_json = request.json()

    if (request.status_code == 200):
        send_qa(request_json['data']['aqi'])

    time.sleep(100)