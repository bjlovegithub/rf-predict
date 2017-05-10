import os
import sys
import time

if __name__ == "__main__":
    try:
        os.mkdir("/tmp/rf")
    except Exception, e:
        print e
        pass

    s = ""
    with open('/Users/yushi.wxg/IDEA/rf-predict/src/main/bin/data/train_model_libsvm.data/part-00000') as f:
        while True:
            l = f.readline()
            if l == "":
                break
            arr = l.strip().split()
            if len(arr) == 18:
                s += arr[0] + " " + " ".join([i.split(":")[1] for i in arr[1:]]) + "\n"

    seq = 1
    while True:
        with open("/tmp/rf/input.%s" % seq, "w") as f:
            f.write(s)
        seq += 1
        if seq >= 10:
            os.system("rm -f /tmp/rf/*")
            seq = 0
        time.sleep(1)
