package net.billjeff.ml.rf

/**
  * Created by yushi.wxg on 2017/5/9.
  */
object Test {
  def main(args: Array[String]) {
    val dataBase = "/Users/yushi.wxg/IDEA/rf-predict/src/main/bin/data"
    val eventTypes = scala.io.Source.fromFile(s"$dataBase/event_type.meta", "utf-8").getLines().toArray
    println(eventTypes.contains("VIEW_REPORT"))
    println(args.mkString("\t"))
  }
}
