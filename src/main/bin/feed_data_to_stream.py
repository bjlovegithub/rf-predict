import os
import sys
import time
import random

def generate():
    """
    Generate a series of features for the user, they will be sent to input directory
    of predictor(spark streaming job).
    """
    recs = []
    num = random.randint(600, 1000)
    for i in range(num):
        arr = [i, random.randint(0, 6), random.randint(0, 8), random.randint(0, 3)]
        for j in range(12):
            arr.append(random.randint(0, 100))
        arr.append(random.randint(0, 2))
        arr.append(random.randint(20, 70))
        recs.append(" ".join([str(i) for i in arr]))
    return "\n".join(recs)

if __name__ == "__main__":
    input_dir = sys.argv[1]

    seq = 1
    while True:
        with open("%s/input.%s" % (input_dir, seq), "w") as f:
            f.write(generate())
        seq += 1
        if seq >= 100:
            os.system("rm -f %s/*" % input_dir)
            seq = 0
        time.sleep(60)
