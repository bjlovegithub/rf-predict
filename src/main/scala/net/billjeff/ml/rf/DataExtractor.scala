package net.billjeff.ml.rf

import org.apache.spark.sql.SparkSession

/**
  * Created by yushi.wxg on 2017/5/9.
  */
object DataExtractor {
  def main(args: Array[String]) {
    val spark = SparkSession
      .builder
      .appName("DataExtractor")
      .getOrCreate()

    val dataBase = "/Users/yushi.wxg/IDEA/rf-predict/src/main/bin/data"
    val eventLogs = spark.read.textFile(s"$dataBase/user_events.log").rdd
    val eventTypes = scala.io.Source.fromFile(s"$dataBase/event_type.meta", "utf-8").getLines().toArray
    val bcEventTypes = spark.sparkContext.broadcast(eventTypes)
    val eventFeatureRdd = eventLogs.map(line => line.split("\t")).filter(arr => {
      arr.length == 7 && bcEventTypes.value.contains(arr(5))
    }).map(arr => {
      arr.update(5, bcEventTypes.value.indexOf(arr(5)).toString)
      arr
    })
    println(eventFeatureRdd.count())
    eventFeatureRdd.foreach(i => println(i.mkString(",")))

    spark.stop()
  }
}
