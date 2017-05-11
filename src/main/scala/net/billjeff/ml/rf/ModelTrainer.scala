package net.billjeff.ml.rf

import java.nio.file.{Files, Paths, StandardOpenOption}

import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.mllib.tree.RandomForest
import org.apache.spark.mllib.util.MLUtils

object ModelTrainer {
  def printUsage() = {
    println("Usage: ModelTrainer <trainDataPath> <modelPath>")
  }

  def main(args: Array[String]): Unit = {
    if (args.length != 2) {
      printUsage()
      System.exit(1)
    }

    val conf = new SparkConf().setAppName("RFModelTrainer")
    val sc = new SparkContext(conf)
    val data = MLUtils.loadLibSVMFile(sc, args(0))
    val splits = data.randomSplit(Array(0.7, 0.3))
    val (trainingData, testData) = (splits(0), splits(1))

    // Configuration to train the RF model.
    // two category: retention or no-retention
    val numClasses = 2
    // fields: industry, region, social_type, `platform`, `event`, gender, age
    // among them, feature 1, 2, 3, 16 are category feature
    // feature 1(6), 2(8), 3(3), 16(2) are categorical features
    val categoricalFeaturesInfo = Map[Int, Int](0 -> 6, 1 -> 8, 2 -> 3, 15 -> 2)
    val numTrees = 3
    val featureSubsetStrategy = "auto"
    val impurity = "gini"
    val maxDepth = 4
    val maxBins = 100

    val model = RandomForest.trainClassifier(trainingData, numClasses, categoricalFeaturesInfo,
      numTrees, featureSubsetStrategy, impurity, maxDepth, maxBins)

    // Evaluate model on test instances and compute test error
    val labelAndPreds = testData.map { point =>
      val prediction = model.predict(point.features)
      (point.label, prediction)
    }

    // save the stat data
    val testErr = labelAndPreds.filter(r => r._1 != r._2).count.toDouble / testData.count()
    val statFile = args(1) + "/stat.data"
    Files.write(Paths.get(statFile), testErr.toString.getBytes(), StandardOpenOption.CREATE);
    val modelFile = args(1) + "/model.data"
    Files.write(Paths.get(modelFile), model.toDebugString.toString.getBytes(), StandardOpenOption.CREATE)

    // save the model
    model.save(sc, args(1))

    sc.stop()
  }
}