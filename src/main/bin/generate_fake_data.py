"""
Generate fake data for user events log / enrished customer information / customer document for
test purpose.
"""

import os
import sys
import time
import random

# user platform where the event is taken place
PLATFORM = ["IPHONE", "ANDROID", "PC", "IPAD", "OTHER"]
# events recorded by the system, for each event, their corresponding user actions include:
# create/modify template, download a template, share a template, inspect/audit, view reports,
# share reports, cancel inspection/aucition
EVENT_TYPE = ["CUSTOMIZE_TPL", "DOWNLOAD_TPL", "SHARE_TPL", "INSPECT", "VIEW_REPORT",
              "SHARE_REPORT", "CANCEL_INSPECTION"]
# type of industries in CRM system
INDUSTRY = ["CONSTRUCTION", "AIRPLANE", "BANK", "INTERNET", "HEALTH", "INSURANCE"]
# region where the client locates
REGION = ["AU-NSW", "AU-WA", "AU-TAS", "US-CA", "US-WA", "CN-BJ", "CN-SH", "GB-LONDON"]
# max number of companies
MAX_COMPANY_NUM = 100
# max number of users
# NOTE:
# the mapping between company to user is based on modular, e.g. user with id 10
# has company id 10 (10%100), user with 121 has company id 21 (121%100)
MAX_USER_NUM = 1000
# users who do not have any activities
NO_ACTIVITY_USER_NUM = 100
# types of social media activies for companies
SOCIAL_TYPE = ["TWITTER", "FACEBOOK", "GOOGLE"]

# dir to keep all generated data
data_dir = "data"
# max event logs for each run of generate_fake_data
MAX_EVENT_LOGS = 10000

def get_timestamp():
    """
    Get a timestamp evenly distributed through current day.
    """
    ts = int(time.time()) / 3600 * 3600
    return ts + random.randint(0, 3599)

def random_element(arr):
    """
    Get an element randomly from input array
    """
    return arr[random.randint(0, len(arr)-1)]

def write_meta():
    def write(fn, data):
        with open(fn, "w") as f:
            for i in data:
                f.write("%s\n" % i)

    write("%s/platform.meta" % data_dir, PLATFORM)
    write("%s/event_type.meta" % data_dir, EVENT_TYPE)
    write("%s/industry.meta" % data_dir, INDUSTRY)
    write("%s/region.meta" % data_dir, REGION)
    write("%s/social_type.meta" % data_dir, SOCIAL_TYPE)

def generate_event_log(prefix):
    """
    Fields for user event log:
      anonymous_id, user_id, company_id, platform, event_time, event_type,
      first_event(1 for first event)
    Everytime, we will set aside some users who do not have any activies
    """

    # set aside some users who do not have any activies
    noActUser = {}
    while (len(noActUser) < NO_ACTIVITY_USER_NUM):
        uid = random.randint(0, MAX_USER_NUM-1)
        if uid not in noActUser:
            noActUser[uid] = 1

    with open("%s/user_events_%s.log" % (data_dir, prefix), "w") as fh:
        num = 0
        while num < MAX_EVENT_LOGS:
            uid = random.randint(0, MAX_USER_NUM-1)
            if uid in noActUser:
                continue
            rec = [num, uid, uid % MAX_COMPANY_NUM, random_element(PLATFORM),
                   get_timestamp(), random_element(EVENT_TYPE), random.randint(0, 1)]
            fh.write("%s\n" % "\t".join([str(i) for i in rec]))
            num += 1

def generate_crm_profile():
    """
    Fields for company crm profiles:
      company_id, industry, region, social_presence
    """
    with open("%s/crm_info.data" % data_dir, "w") as fh:
        for i in range(MAX_COMPANY_NUM):
            rec = [i, random_element(INDUSTRY), random_element(REGION),
                   random_element(SOCIAL_TYPE)]
            fh.write("%s\n" % "\t".join([str(i) for i in rec]))

def generate_customer_doc():
    """
    For data in NoSQL db, since all info about chk lists / insepctions / reports has been
    recorded in user events log, we simple generate data for user profiles relating to
    generate the random forest, including gender, age.
    Fields for user profile:
      user_id, gender(1 for female, 0 for male), age
    """
    with open("%s/nosql_user_profile.data" % data_dir, "w") as fh:
        for i in range(MAX_USER_NUM):
            rec = [i, random.randint(0, 1), random.randint(20, 70)]
            fh.write("%s\n" % "\t".join([str(i) for i in rec]))

if __name__ == "__main__":
    data_dir = sys.argv[1]

    write_meta()
    generate_event_log("week0")
    generate_event_log("week1")
    generate_crm_profile()
    generate_customer_doc()
