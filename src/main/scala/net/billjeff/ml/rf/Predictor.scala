package net.billjeff.ml.rf

import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.SparkConf
import org.apache.spark.mllib.tree.model.RandomForestModel
import org.apache.spark.streaming.{Seconds, StreamingContext}

/**
  * Spark streaming for predicting user retention.
  */
object Predictor {
  def main(args: Array[String]): Unit = {
    if (args.length != 3) {
      println("Usage: Predictor [modelPath] [inputDataDir] [outputDataDir]")
      System.exit(1)
    }

    val conf = new SparkConf().setAppName("RFPredictor")
    val ssc = new StreamingContext(conf, Seconds(60))

    // load the model saved by model trainer
    val model = RandomForestModel.load(ssc.sparkContext, args(0))

    val lines = ssc.textFileStream(args(1))
    lines.map(_.split(" "))
      .filter(_.length == 18)
      .map(arr => {
        (arr(0), model.predict(Vectors.dense(arr.drop(1).map(_.toDouble))))
      })
      .saveAsTextFiles(args(2))

    ssc.start()
    ssc.awaitTermination()
  }
}
