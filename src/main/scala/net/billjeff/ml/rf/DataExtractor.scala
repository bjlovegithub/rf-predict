package net.billjeff.ml.rf

import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.sql.SparkSession

/**
  * Created by yushi.wxg on 2017/5/9.
  */
object DataExtractor {
  def thisWeek(ts: String) : Boolean = {
    true
  }

  def main(args: Array[String]) {
    val spark = SparkSession
      .builder
      .appName("DataExtractor")
      .getOrCreate()

    val dataBase = "/Users/yushi.wxg/IDEA/rf-predict/src/main/bin/data"
    // load event types
    val eventLogsWeek0 = spark.read.textFile(s"$dataBase/user_events_week0.log").rdd
    val eventLogsWeek1 = spark.read.textFile(s"$dataBase/user_events_week1.log").rdd
    // load crm information
    val crmInfo = spark.read.textFile(s"$dataBase/crm_info.data").rdd
    // load user profile
    val userProfile = spark.read.textFile(s"$dataBase/nosql_user_profile.data").rdd

    // load all meta data and broadcast them
    val eventTypes = scala.io.Source.fromFile(s"$dataBase/event_type.meta", "utf-8").getLines().toArray
    val platforms = scala.io.Source.fromFile(s"$dataBase/platform.meta", "utf-8").getLines().toArray
    val industries = scala.io.Source.fromFile(s"$dataBase/industry.meta", "utf-8").getLines().toArray
    val region = scala.io.Source.fromFile(s"$dataBase/region.meta", "utf-8").getLines().toArray
    val socialType = scala.io.Source.fromFile(s"$dataBase/social_type.meta", "utf-8").getLines().toArray

    val bcEventTypes = spark.sparkContext.broadcast(eventTypes)
    val bcPlatforms = spark.sparkContext.broadcast(platforms)
    val bcIndustries = spark.sparkContext.broadcast(industries)
    val bcRegion = spark.sparkContext.broadcast(region)
    val bcSocialType = spark.sparkContext.broadcast(socialType)

    // pre-process event logs, filtering out invalid data, transforming string category feature into numbers
    val week1ActUsers = eventLogsWeek1.map(_.split("\t")).map(_(1)).distinct().map(i => (i, 1))
    val eventFeatureRdd = eventLogsWeek0.map(_.split("\t").tail)
      .filter(arr => {
        arr.length == 6 && bcEventTypes.value.contains(arr(4)) && thisWeek(arr(3)) && bcPlatforms.value.contains(arr(2))
      })
      .keyBy(_(0)).leftOuterJoin(week1ActUsers)
      .map {
        case (uid, (log, isAct)) => {
          // for each input log, it will be extended to:
          //   uid, company_id, IPHONE_cnt, ANDROID_cnt, PC_cnt, IPAD_cnt, OTHER_cnt, CUSTOMIZE_TPL_cnt,
          //   DOWNLOAD_TPL_cnt, SHARE_TPL_cnt, INSPECT_cnt, VIEW_REPORT_cnt, SHARE_REPORT_cnt, CANCEL_INSPECTION_cnt
          // _cnt means the occurrence of the value. e.g. if current user uses IPAD platform for 3 times,
          // IPAD_cnt should be 3.
          val arr = Array(log(0), log(1), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
          arr.update(bcPlatforms.value.indexOf(log(2)) + 2, 1)
          arr.update(bcEventTypes.value.indexOf(log(4)) + 2 + bcPlatforms.value.length, 1)
          (uid, (arr, isAct))
        }
      }
      .reduceByKey {
        case ((log1, isAct1), (log2, isAct2)) => {
          for (i <- 2 until log1.length) {
            log1.update(i, log1(i).asInstanceOf[Int]+log2(i).asInstanceOf[Int])
          }
          var isAct : Option[Int] = Some(1)
          if (isAct1.isEmpty && isAct2.isEmpty) isAct = None
          (log1, isAct)
        }
      }
      .map {
        case (uid, (arr, isAct)) => {
          (Array(isAct.getOrElse(0)) ++ arr).map(_.toString)
        }
      }

    println(eventFeatureRdd.count())
    eventFeatureRdd.foreach(arr => println(arr.mkString("\t")))

    // pre-process crm information
    val crmFeatureRdd = crmInfo.map(_.split("\t"))
      .filter(arr =>
        arr.length == 4 && bcIndustries.value.contains(arr(1)) && bcRegion.value.contains(arr(2)) && bcSocialType.value.contains(arr(3)))
      .map(arr => {
        arr.update(1, bcIndustries.value.indexOf(arr(1)).toString)
        arr.update(2, bcRegion.value.indexOf(arr(2)).toString)
        arr.update(3, bcSocialType.value.indexOf(arr(3)).toString)
        arr
      })
      .keyBy(_(0))

    // pre-process user profile
    val userProfileRdd = userProfile
      .map(_.split("\t"))
      .filter(arr => arr.length == 3 && arr(1).toInt >= 0 && arr(1).toInt <= 1 && arr(2).toInt >= 20 && arr(2).toInt <= 70)
      .keyBy(_(0))

    // join event logs, crm feature and user profile together by company id, and save them for model trainer
    val eventJoinCrmRdd = eventFeatureRdd.keyBy(_(2)).join(crmFeatureRdd).map {case (k, (events, crm)) => {
      // fields: user_id, (is_act, industry, region, social_type, `platform`, `event`)
      // `platform` includes five _cnts, and `event` contains 7 _cnts
      (events(1), Array(events(0), crm(1), crm(2), crm(3)) ++ events.drop(3))
    }}.cache()
    val debug = eventJoinCrmRdd.map { case (k, arr) => Array(k) ++ arr }.cache()
    debug.foreach(arr => println(arr.mkString("\t")))
    println(debug.count())

    val allFeatureRdd = eventJoinCrmRdd.join(userProfileRdd).map {
      case (userId, (eventJoinCrm, profile)) => {
        val features = eventJoinCrm.drop(1) ++ profile.drop(1)
        // fields: industry, region, social_type, `platform`, `event`, gender, age
        // among them, feature 1, 2, 3, 16 are category feature
        LabeledPoint(eventJoinCrm(0).toDouble, Vectors.dense(features.map(_.toDouble)))
      }
    }
    MLUtils.saveAsLibSVMFile(allFeatureRdd, "/Users/yushi.wxg/IDEA/rf-predict/src/main/bin/data/train_model_libsvm.data")

    spark.stop()
  }
}
