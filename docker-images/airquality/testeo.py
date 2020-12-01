
import numpy as np
import random
import time

temp_range = [32,   33,   34,    35, 36,   37,  38,   39,   40,   41]
prob=        [0.03, 0.04, 0.05, 0.2, 0.2, 0.19, 0.1, 0.09, 0.07, 0.03]

def generate_temperature():
    print(np.random.choice(temp_range, p=prob))

while True:
    generate_temperature()
    time.sleep(1)