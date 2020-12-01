import os
import time
import numpy as np
import random
from redis import Redis

redis_params = {
    'host': os.environ.get('REDIS_HOST', 'localhost'),
    'port': int(os.environ.get('REDIS_PORT', 6379)),
    'db': int(os.environ.get('REDIS_DB', 0)),
    'decode_responses': True
}

r = Redis(**redis_params)
sub = r.pubsub()

sum_range  = [-11,   -10,    -5,    -4,   -3,  -2,    -1,   1,     2,   3,     4,    5,   10,   11]
prob=        [0.02,  0.04,  0.06, 0.06, 0.06, 0.09, 0.17, 0.17, 0.09, 0.06, 0.06, 0.06, 0.04, 0.02]
upper_range = 90
lower_range = 60


bloodpressure = 80


def send_bloodpressure(bloodpressure):
    r.publish('bloodpressure', int(bloodpressure))

while True:
    if (bloodpressure > upper_range):
        bloodpressure = bloodpressure - random.randint(-5, 10)
    elif (bloodpressure < lower_range):
        bloodpressure = bloodpressure + random.randint(-5, 10)
    else:
        bloodpressure = bloodpressure + np.random.choice(sum_range, p=prob)

    send_bloodpressure(bloodpressure)
    time.sleep(10)


