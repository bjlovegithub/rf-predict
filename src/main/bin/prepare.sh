!/usr/bin/ sh

target="$0"
bin=`dirname "$target"`

source "$bin/comm.sh"

mkdir -p $FAKE_DATA_DIR
python $BIN_DIR/bin/generate_fake_data.py $FAKE_DATA_DIR

# prepare the input data for model trainer
rm -rf $DATA_EXTRACTOR_OUTPUT_DIR
$SPARK_BIN/spark-submit --master local --class net.billjeff.ml.rf.DataExtractor $JOB_JAR $FAKE_DATA_DIR $DATA_EXTRACTOR_OUTPUT_DIR

# let us train it
mkdir -p $MODEL_DIR
rm -rf $MODEL_DIR/*
$SPARK_BIN/spark-submit --master local --class net.billjeff.ml.rf.ModelTrainer $JOB_JAR $DATA_EXTRACTOR_OUTPUT_DIR/part-00000 $MODEL_DIR

# parse the trained model for web visualization
python $BIN_DIR/bin/parse_rf_tree.py $MODEL_DIR/model.data $WEB_DIR
