import os
import sys
import time
import datetime

def process(predict_base_dir, web_base_dir):
    for fn in os.listdir(predict_base_dir):
        try:
            d = datetime.datetime.fromtimestamp(int(fn.strip("-"))/1000)
            date_str = "%04d%02d%02d%02d%02d" % (d.year, d.month, d.day, d.hour, d.minute)

            total = 0
            positive = 0
            for pn in os.listdir("%s/%s" % (predict_base_dir, fn)):
                if not pn.startswith("part-"):
                    continue

                with open("%s/%s/%s" % (predict_base_dir, fn, pn)) as fh:
                    while True:
                        l = fh.readline().strip()
                        if l == "":
                            break
                        arr = l.split(",")
                        if len(arr) != 2:
                            continue

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


def send_to_sqs(predict_base_dir):
    """
    Send predict result to sqs, so the consumer can get the message ASAP
    """
    import boto3

    sqs = boto3.resource('sqs')
    queue = sqs.get_queue_by_name(QueueName='rf-predict.fifo')

    for fn in os.listdir(predict_base_dir):
        num = 0
        try:
            for pn in os.listdir("%s/%s" % (predict_base_dir, fn)):
                if not pn.startswith("part-"):
                    continue

                with open("%s/%s/%s" % (predict_base_dir, fn, pn)) as fh:
                    while True:
                        # only send 10 messages to sqs to speed up the process, it is only for demo purpose
                        if num > 10:
                            break

                        l = fh.readline().strip()
                        if l == "":
                            break
                        arr = l.split(",")
                        if len(arr) != 2:
                            continue

                        uid = int(float(arr[0].strip("(")))
                        predict = int(float(arr[1].strip(")")))
                        response = queue.send_message(
                            MessageBody='{"uid": "%s", "predict": "%s"' % (uid, predict),
                            QueueUrl='https://sqs.us-east-2.amazonaws.com/143653108209/rf-predict.fifo',
                            MessageGroupId='test',
                            MessageDeduplicationId='test'
                        )
                        num += 1
                        
        except Exception, e:
            print e

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print "Usage: process_predict_result.py [predictResultDir] [webDataDir]"
        sys.exit(1)

    predict_base_dir = sys.argv[1]
    web_base_dir = sys.argv[2]
    while True:
        try:
            send_to_sqs(predict_base_dir)
        except Exception, e:
            print e

        try:
            process(predict_base_dir, web_base_dir)
        except Exception, e:
            print e

        time.sleep(30)

