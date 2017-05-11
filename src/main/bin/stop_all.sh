ps aux | grep -ie feed_data_to_stream | awk '{print $2}' | xargs kill -9
ps aux | grep -ie rf.Predictor | awk '{print $2}' | xargs kill -9
ps aux | grep -ie process_predict_result | awk '{print $2}' | xargs kill -9
