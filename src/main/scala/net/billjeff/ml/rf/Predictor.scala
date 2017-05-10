package net.billjeff.ml.rf

import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.SparkConf
import org.apache.spark.mllib.tree.model.RandomForestModel
import org.apache.spark.storage.StorageLevel
import org.apache.spark.streaming.kafka.KafkaUtils
import org.apache.spark.streaming.{Minutes, Seconds, StreamingContext}

/**
  * Created by yushi.wxg on 2017/5/10.
  */
object Predictor {
  def main(args: Array[String]): Unit = {
    if (args.length != 3) {
      println("Usage: Predictor [modelPath] [inputDataDir] [outputDataDir]")
      System.exit(1)
    }

    val conf = new SparkConf().setAppName("RFPredictor")
    val ssc = new StreamingContext(conf, Seconds(1))

    val sameModel = RandomForestModel.load(ssc.sparkContext, args(0))

    val lines = ssc.textFileStream(args(1))
    val words = lines.map(_.split(" "))
      .filter(_.length == 18)
      .map(arr => {
        println(arr.drop(1).map(_.toDouble).mkString("\t"))
        println(sameModel.predict(Vectors.dense(arr.drop(1).map(_.toDouble))))
        (arr(0), sameModel.predict(Vectors.dense(arr.drop(1).map(_.toDouble))))
      })
      .saveAsTextFiles(args(2))

    ssc.start()
    ssc.awaitTermination()
  }
}
