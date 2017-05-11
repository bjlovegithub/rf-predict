target="$0"
bin=`dirname "$target"`

source "$bin/comm.sh"

# kill old data feeder, which provides faked input data for streaming
ps aux | grep -ie feed_data_to_stream | awk '{print $2}' | xargs kill -9
sleep 1

mkdir -p $PREDICTOR_INPUT_DIR
rm -f $PREDICTOR_INPUT_DIR/*
nohup python $BIN_DIR/bin/feed_data_to_stream.py $PREDICTOR_INPUT_DIR 2>&1 > $DEMO_DIR/feed_data_to_stream.output &

# kill old predictors
ps aux | grep -ie rf.Predictor | awk '{print $2}' | xargs kill -9
sleep 1
# start the predictor
rm -rf $PREDICTOR_OUTPUT_DIR
nohup $SPARK_BIN/spark-submit --master local --class net.billjeff.ml.rf.Predictor $JOB_JAR $MODEL_DIR $PREDICTOR_INPUT_DIR $PREDICTOR_OUTPUT_DIR 2>&1 > $DEMO_DIR/predictor.output &

# kill old predict result data processor
ps aux | grep -ie process_predict_result | awk '{print $2}' | xargs kill -9
sleep 1
# start a new predict result processor
nohup python $BIN_DIR/bin/process_predict_result.py $PREDICTOR_OUTPUT_DIR $WEB_DIR 2>&1 > $DEMO_DIR/process_predict_result.output &

sleep 1

echo "done!"
