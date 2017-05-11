# Data Preparation
## Dump SQL Data
Assuming current week is week2, so previous week is week1, week0, etc. To prepare the data
for model training, the preparation phase will dump **week0** and **week1** user events log
base on the **event_time**. For simplicity, python script *generate_fake_data.py* is used
to generate dumped data for week0 and week1.
SQL data fields:
- anonymous_id
- user_id: random id ranging from 0 to 1000 for demo purpose
- company_id
- platform: platform the user uses, including iphone, ipad, android, pc, other.
- event_time
- event_type: 7 event types for demo: customize template, download template, share template,
inspect, view report, share report, cancel inspection
- first_event

The generated data will be saved at **demo/data**, named user_events_week0.log and
user_events_week1.log

## Dump CRM and NoSQL Data
Predefined profiles for each company and user.

Fields for CRM data:
- company_id: will be **joined** with company_id for each user event.
- industry: CONSTRUCTION, AIRPLANE, BANK, INTERNET, HEALTH, INSURANCE
- region: AU-NSW, AU-WA, AU-TAS, US-CA, US-WA, CN-BJ, CN-SH, GB-LONDON
- social_type: TWITTER, FACEBOOK, GOOGLE

Fields for user profile:
- user_id
- gender
- age: from 20 to 70

## Prepare Data for Model Trainer
At this phase, the data from **Data Preparation** will be processed by spark batch job
to generate data containing all features for model training.

All input data will be **parsed** and **filtered** at first, since there will be invalid
input data. **platform** field from user event is extended to five fields, using their
platform name as field name, their value is the number of times for the user to operate
on this platform during this week. So does **event_type**, seven extra fields will be
generated. Those fields are treated as features for random forest training and prediction.
It is based on the consideration that users may use some specific platform, like ipad
, and specific operation for auditing. These features count a lot for prediction.

After that, user event is **joined** against CRM info to include industry, region and
social type on **company_id**. Then new records will join with user profile, adding gender
 and age on **user_id**.

 Finally, the result data set is saved to **demo/extracted_data**. This is done by
 *DataExtractor.scala*.

 ## Train Model
 Everything is ready, now it is the right time to train the model. The input data
 is from **Prepare Data for Model Trainer** phase. It will be splitted into two sets:
 **trainSet** and **testSet**. trainSet is for model training, and testSet is for evaluation.

 While training the model, fields: industry, region, social_type, `platform`, `event`, gender, age
 among them, feature 1, 2, 3, 16 are **categorical** feature. `platform` represents five
 platform feature, and `event` represents seven user events fields. The left fields
 are **continuous** features. Train parameters, like depth, can be tuned by using
 different combination / error rate.

 The trained result includes **model file** for model predictor, **model data** for
 visualization. They are saved at **demo/model**. It is done by *ModelTrainer.scala*.

 # RealTime Prediction
 The trained model is loaded into spark streaming job for realtime prediction. This is
 done by *Predictor.scala*.
 ## Data Input
 Basically, **Kafka** message queue is an ideal data source for streaming processing.
 For simplicity, I use a script, named *feed_data_to_stream.py* to place generated user
 features into a file directory, which will be consumed by predictor.

 ## Data Output
 Just like data input, the result can be written into a message queue. For simplicity,
 all result data, a tuple including a user id and prediction result, is saved to a
 local directory. A script named *process_predict_result.py* will send result to
 **Amazon SQS** service, so the consumer can receive prediction result timely, as long
 as they subscribe to the topic.

 # Visualization
 A simple http server based on **express** is to display the trained model(random forests)
 and prediction result.

 ## Model Visualization
 Once the model is generated, a script named *parse_rf_tree.py* will take the model meta
 data and convert them into json format. D3.js is used to display them on a simple page.
 By clicking **tree0**, **tree1** and **tree3** on the page, each trees in the forest
 will be shown on the page. The parser is based on an open source project:
 https://github.com/tristaneljed/Decision-Tree-Visualization-Spark/

 ## Prediction Result Visualization
 Two trend curve are shown to display the trend for each round of prediction. It tells
 number of retention users and total users for each round.

 # Online Demo
 I deployed the whole procedure on a Amazon EC2 server, we can get the model visualization
 at: http://52.14.100.84:7777/tree.html,
 and prediction result at: http://52.14.100.84:7777/trend.html

 # Build and Run
 ## Prerequisite
 The following tools have to be installed:
 - python 2.7
 - aws boto3
 - spark 2.11 binary
 - java 1.7+
 - scala 2.11
 - node
 - npm

 ## Build
 cd to the root directory of extracted source, and run **mvn package** to build the project.

 ## Run
 At any path, run the following commands:
 - [path_to_bin]/**prepare.sh**: it will generate demo data, extract and join the data,
 train model, and parse the tree for the web.
 - [path_to_bin]/**run.sh**: start sparking streaming(predictor) and scripts to feed data
 into streaming job and process the result from streaming job
 - [path_to_bin]/**stop.sh**: stop all deamon processes, including streaming jobs and
 scirpts.
 - cd to web directory
   * run **npm install** to install dependent packages to run the http server.
   * run **node demo_server.js** to start the server, access tree and prediction result
   visualization through http://127.0.0.1:7777/tree.html and http://127.0.0.1:7777/trend.html
