import os
import sys
import datetime

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print "Usage: process_predict_result.py [predictResultDir] [webDataDir]"
        sys.exit(1)

    predict_base_dir = sys.argv[1]
    web_base_dir = sys.argv[2]
    for fn in os.listdir(sys.argv[1]):
        try:
            d = datetime.datetime.fromtimestamp(int(fn)/1000)
            date_str = "%04d%02d%02d%02d%02d" % (d.year, d.month, d.day, d.hour, d.minute)

            total = 0
            positive = 0
            with open("%s/%s/part-00000" % (predict_base_dir, fn)) as fh:
                while True:
                    l = fh.readline().strip()
                    if l == "":
                        break
                    arr = l.split(",")
                    if len(arr) != 2:
                        continue

                    print arr[1].strip(")")
                    predict = int(float(arr[1].strip(")")))
                    if predict == 1:
                        positive += 1
                    total += 1

            if total != 0:
                # write stat data into data directory for the web
                with open("%s/predict_result.tsv" % web_base_dir, "a") as f:
                    f.write("%s\t%s\t%s\n" % (date_str, positive, total))

            # move processed file into processed dir
            try:
                os.mkdir("%s/processed" % web_base_dir)
            except Exception, e:
                print e
            os.system("mv %s/%s %s/processed" % (predict_base_dir, fn, web_base_dir))
        except Exception, e:
            print e
    
    
