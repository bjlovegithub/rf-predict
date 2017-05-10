var express = require('express');
var fs      = require('fs');
var app = express();

var web_root = '/api'

app.get('/data.tsv',function(req,res){
    return res.send("date	New York	San Francisco	Austin\n20111001	63.4	62.7	72.2\n20111002	58.0	59.9	67.7\n")
})

// for job overview page
app.get(web_root+'/jobs/:jobid/summary',function(req,res){
    return res.json(job)
})

app.get(web_root+'/jobs/:jobid/plan',function(req,res){
        res.json(plan);
})

app.get(web_root+'/jobs/:jobid/vertices',function(req,res){
    res.json(job_vertices)
})

// for checkpoint page
app.get(web_root+'/jobs/:jobid/checkpoints',function(req,res){
    res.json(checkpoints);
})
app.get(web_root+'/jobs/:jobid/checkpoints/vertices/:vertexid',function(req,res){
    res.json(task_latest_completed_checkpoints);
})

// for job manager page
app.get(web_root+'/jobs/:jobid/jobmanager/overview',function(req,res){
    res.json(job_manager_overview);
})
app.get(web_root+'/jobs/:jobid/jobmanager/metrics',function(req,res){
    res.json(job_manager_metrics);
})

// for failover
app.get(web_root+'/jobs/:jobid/failover/taskfailover',function(req,res){
    res.json(task_failover);
})

// for task executors
app.get(web_root+'/jobs/:jobid/taskexecutors/overview',function(req,res){
    res.json(task_executor_overview);
})
app.get(web_root+'/jobs/:jobid/taskexecutors/:resourceid/metrics',function(req,res){
    res.json(task_executor_metrics);
})

// for about page
app.get(web_root+'/jobs/:jobid/about',function(req,res){
    res.json(job_about)
})

// for job conf page
app.get(web_root+'/jobs/:jobid/configuration',function(req,res){
    res.json(configure)
})

//app.get(web_root+'/jobs/:jobid/vertices/:vertexid/info',function(req,res){
//    res.json(execution_job_vertex_info)
//})

// for execution job vertex page
app.get(web_root+'/jobs/:jobid/vertices/:vertexid/summary',function(req,res){
    res.json(execution_job_vertex_summary)
})

app.get(web_root+'/jobs/:jobid/vertices/:vertexid/subtasks',function(req,res){
    res.json(execution_vertices)
})

app.get(web_root+'/jobs/:jobid/vertices/:vertexid/metrics',function(req,res){
    res.json(execution_job_vertex_metrics)
})

app.get(web_root+'/jobs/:jobid/vertices/:vertexid/accumulators',function(req,res){
    res.json(execution_job_vertex_accumulators)
})

// for execution vertex page
app.get(web_root+'/jobs/:job_id/vertices/:vertexid/subtasks/:subtaskid',function(req,res){
    res.json(executions)
})
/*
app.get(web_root+'/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/metrics',function(req,res){
    res.json(execution_vertex_metrics)
})
app.get(web_root+'/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/accumulators',function(req,res){
    res.json(execution_vertex_accumulators)
})
*/

// for execution attempt page
app.get(web_root+'/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/metrics',function(req,res){
    execution_metrics.metrics.splice(0,0,{
        "group": "system",
        "name": "aa",
        "description": "num_bytes_in",
        "value":  1034814599.0
    })
    execution_metrics.metrics.forEach(function(metric){
        if (metric.name == "TPS"){
            metric.value = Math.ceil(Math.random() * 250);
        }
    })
    res.json(execution_metrics)
})

app.get(web_root+'/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/accumulators',function(req,res){
    res.json(execution_accumulators)
})

app.get(web_root+'/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/log',function(req,res){
    res.json(execution_log)
})



// set up the local server
app.use('/', express.static(__dirname+"/"));

console.log(__dirname)

app.listen(7777);


// variables for restful api
var jobid =
{
      "jid": "bfb90baf01bfa2d51ef0258debcef535"
}

var job=
{
  "id": "bfb90baf01bfa2d51ef0258debcef535",
  "name": "Async I/O Example",
  "status": "RUNNING",
  "start_time": 1450164790433,
  "stop_time": -1,
  "duration": 1116262,
  "vertices": 7,
  "CREATED": 1,
  "SCHEDULED": 1,
  "RUNNING": 1,
  "FINISHED": 1,
  "CANCELED": 1,
  "FAILED": 1,
  "CANCELING": 2,
  "vcore_total": 99.123,
  "memory_total": 99
}


var job_about={
      "version": "0.1.0",
      "jdk": "1.7",
      "builder": "test"
}

var job_manager_overview =
 {
    "info": [{
        "log_url": "http://www.taobao.com/",
		"host": "good!",
		"resource_id": "test_id",
		"id": "0"
	}]
}

var job_manager_metrics =
{
	"jvm": [{
		"name": "numRecordsInPerSecond",
		"value": "1"
	}]
}

var task_failover =
{
	"root-exception": "test",
	"failoverHistoryRecords": [{
		"message": "task failed for npe",
		"name": "evj-1",
		"state": "FAILED",
		"timestamp": 1,
		"location": "test.host:111",
		"subtask_id": 0,
		"attempt_number": 1,
		"id": 0
	}],
	"truncated": false
}

var execution_log=
{
	"url": "http://2.2.2.2:8081/node/containerlogs/container_111/bad_guy",
	"jmx": "jmx_url",
	"jmx_data": "123\n456",
}

var checkpoints =
{
	"summary": {
		"count": 4,
		"external-path": "hdfs://user/blink",
		"duration": {
			"min": 1,
			"max": 8282,
			"avg": 2815
		},
		"size": {
			"min": 0,
			"max": 1024,
			"avg": 287
		}
	},
	"completed_checkpoint_info": [{
		"id": 0,
		"start_time": 1,
		"duration": 1,
		"size": 124
	}, {
		"id": 1,
		"start_time": 5,
		"duration": 177,
		"size": 0
	}, {
		"id": 2,
		"start_time": 6,
		"duration": 8282,
		"size": 2
	}, {
		"id": 3,
		"start_time": 6812,
		"duration": 2800,
		"size": 1024
	}],
	"tasks": {
		"0": "1f94b4b358a929e0bee064022b42333c"
	}
}

var task_latest_completed_checkpoints =
{
	"tasks": [{
		"id": "0",
		"vertex_id": "1f94b4b358a929e0bee064022b42333c"
	}, {
       	"id": "1",
       	"vertex_id": "1f94b4b358a929e0bee064022b42333d"
    }],

	"summary": {
		"start_time": 1,
		"duration": 2,
		"size": 3,
		"checkpoint_id": 0
	},

	"subtasks": [{
		"id": 0,
		"duration": 111,
		"size": 222
	}]
}

var execution_metrics=
{
    "total": 24,
    "metrics": [
        {
            "group": "system",
            "name": "num_records_out",
            "description": "num_records_out",
            "value": 2966.0
        },
        {
            "group": "system",
            "name": "num_records_in",
            "description": "num_records_in",
            "value": 7385.0
        },
        {
            "group": "system",
            "name": "num_bytes_out",
            "description": "num_bytes_out",
            "value": 49526.0
        },
        {
            "group": "system",
            "name": "queue_in_usage",
            "description": "num_bytes_out",
            "value": 0.2
        },
        {
            "group": "system",
            "name": "latency_75",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_95",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_99",
            "description": "latency",
            "value": 0.0
        }
	]
};

var execution_metrics =
{
    "metrics": [
        {
            "name": "queue_in_cnt_value",
            "value": 0
        },
        {
            "name": "queue_out_cnt_value",
            "value": 0
        },
        {
            "name": "queue_in_per_value",
            "value": 0
        },
        {
            "name": "queue_out_per_value",
            "value": 0
        },
        {
            "name": "lag_value",
            "value": 0
        },
        {
            "name": "latency_value",
            "value": 0
        },
        {
            "name": "delay_value",
            "value": 0
        },
        {
            "name": "num_records_in_value",
            "value": 111
        },
        {
            "name": "num_records_out_value",
            "value": 111
        },
        {
            "name": "tps_value",
            "value": 111
        }
    ]
};

var execution_accumulators =
{
	"accumulators":
	[
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "value": 21.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "value": 0.006636764356150898
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "value": 0.006636764356150898
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "value": 1.337233320668882
        }
    ]
}
var executions=
{
	"executions": [{
		"id": "c1f54e6c1564413ae3f1ff85fc545d75",
		"attempt_number": 1,
		"status": "RUNNING",
		"start_time": 0,
		"stop_time": 0,
		"duration": 0,
		"message": "bad boy!!!",
		"resource": "resource"
	}, {
		"id": "c1f54e6c1564413ae3f1ff85fc545d75",
		"attempt_number": 1,
		"status": "RUNNING",
		"start_time": 0,
		"stop_time": 0,
		"duration": 0,
		"message": "bad boy!!!",
		"resource": "resource"
	}]
}

var execution_vertex_metrics =
{
    "metrics": [
        {
            "group": "system",
            "name": "num_bytes_out",
            "description": "num_bytes_out",
            "value": 49526.0
        },
        {
            "group": "system",
            "name": "latency_75",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_95",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_99",
            "description": "latency",
            "value": 0.0
        }
	]
}

var execution_vertex_accumulators =
{
	"accumulators": [
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "value": 1614.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "value": 21.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "value": 0.00708039374069592
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "value": 0.00708039374069592
        }
	]
}

var configure = {
    "total": 2,
    "configs": [
        {
            "name": "dfs.datanode.data.dir",
            "value": "file:///dump/2/dfs/data,file:///dump/3/dfs/data,file:///dump/4/dfs/data,file:///dump/5/dfs/data,file:///dump/6/dfs/data,file:///dump/7/dfs/data,file:///dump/8/dfs/data,file:///dump/9/dfs/data,[SSD]file:///dump/10/dfs/data,[SSD]file:///dump/11/dfs/data,[SSD]file:///dump/1/dfs/data"
        },
        {
            "name": "dfs.namenode.checkpoint.txns",
            "value": "40000000"
        }
    ]
}

var execution_job_vertex_metrics =
{
    "metrics": [
        {
            "name": "queue_in_cnt_sum",
            "value": 0
        },
        {
            "name": "queue_out_cnt_sum",
            "value": 0
        },
        {
            "name": "queue_in_per_sum",
            "value": 0
        },
        {
            "name": "queue_out_per_sum",
            "value": 0
        },
        {
            "name": "lag_sum",
            "value": 0
        },
        {
            "name": "latency_sum",
            "value": 0
        },
        {
            "name": "delay_sum",
            "value": 0
        },
        {
            "name": "num_records_in_sum",
            "value": 117
        },
        {
            "name": "num_records_out_sum",
            "value": 111
        },
        {
            "name": "tps_sum",
            "value": 112
        }
    ]
}

var execution_job_vertex_accumulators = {
    "accumulators": [
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "value": 7061.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "value": 158.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "value": 0.015641239496602122
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "value": 0.015641239496602122
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "value": 3.025732191362966
        }
    ]
}

var execution_job_vertex_summary =
{
	"job_vertex_name": "test name",
	"topology_id": "e0e53c9779b99c8953729c3684e1dbbb"
}

var execution_vertices = {
    "execution_vertices": [
        {
            "id": "0",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "CANCELING",
            "start_time": 0,
            "duration": 1652446.0,
            "stop_time": 0,
			"execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":1},
            "metric_summary": {
				"metrics": [
					{
                        "name": "queue_in_cnt",
                        "value": 49526.0
                    },
                    {
                        "name": "latency_cnt",
                        "value": 0.3
                    },
                    {
                        "name": "num_records_out_cnt",
                        "value": 966.0
                    },
                    {
                        "name": "num_records_in_cnt",
                        "value": 7385.0
                    },
                    {
                        "name": "tps_cnt",
                        "value": 4.53995529511861
                    },
                    {
                        "name": "queue_in_per_cnt",
                        "value": 0.2
                    },
                    {
                        "name": "queue_out_per_cnt",
                        "value": 0.2
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1011"
        },
        {
            "id": "1",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "RUNNING",
            "start_time": 1.450154790481E12,
            "duration": 1652446.0,
            "stop_time": 1.45016481626E12,
			"execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0},
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "name": "num_bytes_out",
                        "value": 52321.0
                    },
                    {
                        "name": "latency_75",
                        "value": 0.0
                    },
                    {
                        "name": "latency_95",
                        "value": 0.0
                    },
                    {
                        "name": "latency_99",
                        "value": 0.0
                    },
                    {
                        "name": "latency_average",
                        "value": 0.008413624643777989
                    },
                    {
                        "name": "latency_max",
                        "value": 1.0
                    },
                    {
                        "name": "latency_median",
                        "value": 0.0
                    },
                    {
                        "name": "latency_min",
                        "value": 0.0
                    },
                    {
                        "name": "num_bytes_in",
                        "value": 348280.0
                    },
                    {
                        "name": "num_records_out",
                        "value": 1021.0
                    },
                    {
                        "name": "num_records_in",
                        "value": 7369.0
                    },
                    {
                        "name": "TPS",
                        "value": 4.529782288913928
                    },
                    {
                        "name": "queue_in_usage",
                        "value": 0.3
                    },
                    {
                        "name": "queue_out_usage",
                        "value": 0.7
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1012"
        },
        {
            "id": "12",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "RUNNING",
            "start_time": 1.450164790481E12,
            "duration": 1652447.0,
            "stop_time": 1.450164816534E12,
			"execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0},
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "name": "num_bytes_out",
                        "value": 52624.0
                    },
                    {
                        "name": "latency_75",
                        "value": 0.0
                    },
                    {
                        "name": "latency_95",
                        "value": 0.0
                    },
                    {
                        "name": "latency_99",
                        "value": 1.0
                    },
                    {
                        "name": "latency_average",
                        "value": 0.013241937996572676
                    },
                    {
                        "name": "latency_max",
                        "value": 1.0
                    },
                    {
                        "name": "latency_median",
                        "value": 0.0
                    },
                    {
                        "name": "latency_min",
                        "value": 0.0
                    },
                    {
                        "name": "num_bytes_in",
                        "value": 308564.0
                    },
                    {
                        "name": "num_records_out",
                        "value": 1029.0
                    },
                    {
                        "name": "num_records_in",
                        "value": 6419.0
                    },
                    {
                        "name": "queue_in_usage",
                        "value": 0.1
                    },
                    {
                        "name": "queue_out_usage",
                        "value": 0.9
                    },
                    {
                        "name": "TPS",
                        "value": 3.946469664934335
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1013"
        },
        {
            "id": "3",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "RUNNING",
            "start_time": 1.450164790481E12,
            "duration": 1652447.0,
            "stop_time": 1.450164816526E12,
			"execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0},
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "name": "num_bytes_out",
                        "value": 50164.0
                    },
                    {
                        "name": "latency_75",
                        "value": 0.0
                    },
                    {
                        "name": "latency_95",
                        "value": 0.0
                    },
                    {
                        "name": "latency_99",
                        "value": 0.0
                    },
                    {
                        "name": "latency_average",
                        "value": 0.009843284548633596
                    },
                    {
                        "name": "latency_max",
                        "value": 1.0
                    },
                    {
                        "name": "latency_median",
                        "value": 0.0
                    },
                    {
                        "name": "latency_min",
                        "value": 0.0
                    },
                    {
                        "name": "num_bytes_in",
                        "value": 366240.0
                    },
                    {
                        "name": "num_records_out",
                        "value": 985.0
                    },
                    {
                        "name": "num_records_in",
                        "value": 7721.0
                    },
                    {
                        "name": "queue_in_usage",
                        "value": 0.111
                    },
                    {
                        "name": "queue_out_usage",
                        "value": 0.2222
                    },
                    {
                        "name": "TPS",
                        "value": 4.7469298043374675
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1014"
        }
    ]
}

var execution_vertices =
{
	"execution_vertices": [{
		"id": 0,
		"name": "test task",
		"status": "RUNNING",
		"start_time": 0,
		"stop_time": 0,
		"duration": 0,
		"execution_summary": {
			"CREATED": 0,
			"SCHEDULED": 0,
			"DEPLOYING": 0,
			"RUNNING": 0,
			"FINISHED": 0,
			"CANCELING": 0,
			"CANCELED": 0,
			"FAILED": 0,
			"RECONCILING": 0
		},
		"retries": 16,
		"host": "1.1.1.1",
		"port": 1111,
		"metric_summary": {
			"metrics": [{
				"name": "queue_in_cnt_value",
				"value": 0.0
			}, {
				"name": "queue_out_cnt_value",
				"value": 0.0
			}, {
				"name": "queue_in_per_value",
				"value": 0.0
			}, {
				"name": "queue_out_per_value",
				"value": 0.0
			}, {
				"name": "lag_value",
				"value": 0.0
			}, {
				"name": "latency_value",
				"value": 0.0
			}, {
				"name": "delay_value",
				"value": 0.0
			}, {
				"name": "num_records_in_value",
				"value": 111.0
			}, {
				"name": "num_records_out_value",
				"value": 111.0
			}, {
				"name": "tps_value",
				"value": 111.0
			}]
		}
	}]
}

var job_vertices= {
    "job_vertices":[{
        "id":"51079cf65c9a38dac3086c2aa0596b48",
        "topology_id":0,
        "name":"Source: PayTTTableSource -> PayTTTableParse -> PayTTTableSelect -> OrderTableFilter -> OrderTableShuffle",
        "status":"RUNNING",
        "start_time":1.477561990327E12,
        "duration":4413765.0,
        "stop_time":-1.0,
        "metric_summary":{
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":31.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":31.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":31.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":31.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":31.0},
                {"name":"lag_avg","value":1305.8462},
                {"name":"lag_cnt","value":13.0},
                {"name":"lag_max","value":1666.0},
                {"name":"lag_min","value":1055.0},
                {"name":"lag_sum","value":16976.0},
                {"name":"latency_avg","value":0.2772},
                {"name":"latency_cnt","value":13.0},
                {"name":"latency_max","value":0.3652},
                {"name":"latency_min","value":0.1346},
                {"name":"latency_sum","value":3.603},
                {"name":"num_records_out_avg","value":1.1077770375E7},
                {"name":"num_records_out_cnt","value":32.0},
                {"name":"num_records_out_max","value":1.1157816E7},
                {"name":"num_records_out_min","value":1.1015872E7},
                {"name":"num_records_out_sum","value":3.54488652E8},
                {"name":"tps_avg","value":0.0271},
                {"name":"tps_cnt","value":32.0},
                {"name":"tps_max","value":0.1333},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":0.8667}
            ]
        },
        "parallelism":32,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"061abcbfd3f5323cef8be00e311a9796",
        "topology_id":1,
        "name":"OrderTableReduce -> OrderTableSelect",
        "status":"RUNNING","start_time":1.47756199133E12,
        "duration":4412764.0,"stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":31.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":31.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":31.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":31.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":31.0},
                {"name":"latency_avg","value":0.2962},
                {"name":"latency_cnt","value":14.0},
                {"name":"latency_max","value":0.3341},
                {"name":"latency_min","value":0.202},
                {"name":"latency_sum","value":4.1467},
                {"name":"delay_avg","value":62.1429},
                {"name":"delay_cnt","value":14.0},
                {"name":"delay_max","value":92.0},
                {"name":"delay_min","value":0.0},
                {"name":"delay_sum","value":870.0},
                {"name":"num_records_in_avg","value":1.15279309688E7},
                {"name":"num_records_in_cnt","value":32.0},
                {"name":"num_records_in_max","value":1.2103076E7},
                {"name":"num_records_in_min","value":1.0950114E7},
                {"name":"num_records_in_sum","value":3.68893791E8},
                {"name":"num_records_out_avg","value":1.1525119625E7},
                {"name":"num_records_out_cnt","value":32.0},
                {"name":"num_records_out_max","value":1.2100214E7},
                {"name":"num_records_out_min","value":1.0947316E7},
                {"name":"num_records_out_sum","value":3.68803828E8},
                {"name":"tps_avg","value":0.0292},
                {"name":"tps_cnt","value":32.0},
                {"name":"tps_max","value":0.5333},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":0.9333}
            ]
        },
        "parallelism":32,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"e51e9f749310276ab9703f7fee060428",
        "topology_id":2,
        "name":"OrderTableUnique -> (KeyedOrderTableSelect, AllSellerTableD1021Shuffle, AllItemTableD1022Shuffle)",
        "status":"RUNNING",
        "start_time":1.477561992982E12,
        "duration":4411115.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":31.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":31.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":31.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":31.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":31.0},
                {"name":"latency_avg","value":0.185},
                {"name":"latency_cnt","value":3969.0},
                {"name":"latency_max","value":12.4724},
                {"name":"latency_min","value":0.0571},
                {"name":"latency_sum","value":734.1043},
                {"name":"delay_avg","value":54.7072},
                {"name":"delay_cnt","value":3969.0},
                {"name":"delay_max","value":155.0},
                {"name":"delay_min","value":1.0},
                {"name":"delay_sum","value":217133.0},
                {"name":"num_records_in_avg","value":1.1525119625E7},
                {"name":"num_records_in_cnt","value":32.0},
                {"name":"num_records_in_max","value":1.2100254E7},
                {"name":"num_records_in_min","value":1.0947292E7},
                {"name":"num_records_in_sum","value":3.68803828E8},
                {"name":"num_records_out_avg","value":3.38171765938E7},
                {"name":"num_records_out_cnt","value":32.0},
                {"name":"num_records_out_max","value":3.5480204E7},
                {"name":"num_records_out_min","value":3.2139113E7},
                {"name":"num_records_out_sum","value":1.082149651E9},
                {"name":"tps_avg","value":8.2689},
                {"name":"tps_cnt","value":32.0},
                {"name":"tps_max","value":81.4667},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":264.6052}
            ]
        },
        "parallelism":32,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"95fde309623c534a1d310b5e692cc788",
        "topology_id":3,
        "name":"TypedOrderTableCrossApply -> TypedOrderTableSelect -> (Type5OrderTableFilter -> (BuyerTableD1011Shuffle, ResultTableD1012Filter -> ResultTableD1012Select), Type2OrderTableFilter -> (TypedSellerTableD1021Shuffle, TypedItemTableD1022Shuffle, ResultTableD1023Filter -> ResultTableD1023Select))",
        "status":"RUNNING",
        "start_time":1.477561993353E12,
        "duration":4410746.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":159.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":159.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":159.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":159.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":159.0},
                {"name":"latency_avg","value":0.5885},
                {"name":"latency_cnt","value":13701.0},
                {"name":"latency_max","value":311.4605},
                {"name":"latency_min","value":0.1431},
                {"name":"latency_sum","value":8063.0442},
                {"name":"delay_avg","value":47.2507},
                {"name":"delay_cnt","value":13701.0},
                {"name":"delay_max","value":463.0},
                {"name":"delay_min","value":-1.0},
                {"name":"delay_sum","value":647382.0},
                {"name":"num_records_in_avg","value":2331645.9063},
                {"name":"num_records_in_cnt","value":160.0},
                {"name":"num_records_in_max","value":2331663.0},
                {"name":"num_records_in_min","value":2331631.0},
                {"name":"num_records_in_sum","value":3.73063345E8},
                {"name":"num_records_out_avg","value":770792.9125},
                {"name":"num_records_out_cnt","value":160.0},
                {"name":"num_records_out_max","value":775311.0},
                {"name":"num_records_out_min","value":765643.0},
                {"name":"num_records_out_sum","value":1.23326866E8},
                {"name":"tps_avg","value":5.7092},
                {"name":"tps_cnt","value":160.0},
                {"name":"tps_max","value":14.3333},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":913.4649}
            ]
        },
        "parallelism":160,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":160,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"44214664264953a481526820a1ff81df",
        "topology_id":4,
        "name":"BuyerTableD1011Reduce -> BuyerTableD1011Select -> FilterBuyerTableD1011Filter -> FilterBuyerTableD1011Select",
        "status":"RUNNING",
        "start_time":1.477561996951E12,
        "duration":4407157.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":1.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":1.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":1.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":1.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":1.0},
                {"name":"latency_avg","value":0.1689},
                {"name":"latency_cnt","value":397.0},
                {"name":"latency_max","value":0.8277},
                {"name":"latency_min","value":0.0228},
                {"name":"latency_sum","value":67.0639},
                {"name":"delay_avg","value":51.0856},
                {"name":"delay_cnt","value":397.0},
                {"name":"delay_max","value":101.0},
                {"name":"delay_min","value":0.0},
                {"name":"delay_sum","value":20281.0},
                {"name":"num_records_in_avg","value":7637931.0},
                {"name":"num_records_in_cnt","value":2.0},
                {"name":"num_records_in_max","value":7713089.0},
                {"name":"num_records_in_min","value":7562773.0},
                {"name":"num_records_in_sum","value":1.5275862E7},
                {"name":"num_records_out_avg","value":346595.5},
                {"name":"num_records_out_cnt","value":2.0},
                {"name":"num_records_out_max","value":414516.0},
                {"name":"num_records_out_min","value":278675.0},
                {"name":"num_records_out_sum","value":693191.0},
                {"name":"tps_avg","value":13.2333},
                {"name":"tps_cnt","value":2.0},
                {"name":"tps_max","value":14.3333},
                {"name":"tps_min","value":12.1333},
                {"name":"tps_sum","value":26.4667}
            ]
        },
        "parallelism":2,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":2,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"d1204a822419eac4c32821608aee8141",
        "topology_id":5,
        "name":"FilterBuyerTableD1011Unique",
        "status":"RUNNING",
        "start_time":1.477561998274E12,
        "duration":4405834.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":1.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":1.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":1.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":1.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":1.0},
                {"name":"latency_avg","value":0.1057},
                {"name":"latency_cnt","value":5.0},
                {"name":"latency_max","value":0.1675},
                {"name":"latency_min","value":0.0269},
                {"name":"latency_sum","value":0.5286},
                {"name":"delay_avg","value":63.4},
                {"name":"delay_cnt","value":5.0},
                {"name":"delay_max","value":91.0},
                {"name":"delay_min","value":25.0},
                {"name":"delay_sum","value":317.0},
                {"name":"num_records_in_avg","value":693191.0},
                {"name":"num_records_in_cnt","value":1.0},
                {"name":"num_records_in_max","value":693191.0},
                {"name":"num_records_in_min","value":693191.0},
                {"name":"num_records_in_sum","value":693191.0},
                {"name":"num_records_out_avg","value":68505.0},
                {"name":"num_records_out_cnt","value":1.0},
                {"name":"num_records_out_max","value":68505.0},
                {"name":"num_records_out_min","value":68505.0},
                {"name":"num_records_out_sum","value":68505.0},
                {"name":"tps_avg","value":0.3334},{"name":"tps_cnt","value":1.0},
                {"name":"tps_max","value":0.3334},{"name":"tps_min","value":0.3334},
                {"name":"tps_sum","value":0.3334}
            ]
        },
        "parallelism":1,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":1,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"2400d839e54ec466ff6126c42d9f24ec",
        "topology_id":6,
        "name":"ResultTableD1011Join -> ResultTableD1011TTAssembler -> Sink: ResultTableD1011TTSink",
        "status":"RUNNING",
        "start_time":1.477561998388E12,
        "duration":4405721.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":40,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":7.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":7.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":7.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":0.0},
                {"name":"queue_out_per_cnt","value":7.0},
                {"name":"queue_out_per_max","value":0.0},
                {"name":"queue_out_per_min","value":0.0},
                {"name":"queue_out_per_sum","value":0.0},
                {"name":"latency_avg","value":0.323},
                {"name":"latency_cnt","value":380.0},
                {"name":"latency_max","value":1.8307},
                {"name":"latency_min","value":0.0495},
                {"name":"latency_sum","value":122.7489},
                {"name":"delay_avg","value":52.1895},
                {"name":"delay_cnt","value":380.0},
                {"name":"delay_max","value":122.0},
                {"name":"delay_min","value":1.0},
                {"name":"delay_sum","value":19832.0},
                {"name":"num_records_in_avg","value":2459599.875},
                {"name":"num_records_in_cnt","value":8.0},
                {"name":"num_records_in_max","value":2567739.0},
                {"name":"num_records_in_min","value":2418941.0},
                {"name":"num_records_in_sum","value":1.9676799E7},
                {"name":"tps_avg","value":3.1666},
                {"name":"tps_cnt","value":8.0},
                {"name":"tps_max","value":5.133},
                {"name":"tps_min","value":2.1333},
                {"name":"tps_sum","value":25.3328}
            ]
        },
        "parallelism":8,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":8,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    }
    ]
};


/*
var execution_job_vertex_info = {
    "job_vertex_id":"717c7b8afebbfb7137f6f0f99beb2a94",
    "job_name":"TaobaoAntiSpamD101",
    "job_vertex_name":"Source: PayTTTableSource -> PayTTTableParse -> PayTTTableSelect -> OrderTableFilter -> OrderTableShuffle"
};
*/

var plan = {
    "jid":"6679a5480e8c496f3c6a4a87edaae2e2",
    "name":"pora-ML-592",
    "nodes":[{
        "id":"51079cf65c9a38dac3086c2aa0596b48",
        "parallelism":26,
        "description":"Source: Source_search_pay_log_press -> Parse_search_pay_log_press -> MarkPartitionId_search_pay_log_press",
        "vcore":1.0,"memory":2702.0,"topology_id":"0",
        "inputs":[],
        "delay":561.5820072393678,
        "latency":0.040978552755917816,
        "tps":1635.6623624722365
    },{
        "id":"061abcbfd3f5323cef8be00e311a9796",
        "parallelism":1024,
        "description":"Source: Source_wireless_search_item_pv_413 -> Parse_wireless_search_item_pv_413 -> MarkPartitionId_wireless_search_item_pv_413",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"1",
        "inputs":[],
        "delay":1476.2328656790578,
        "latency":0.09595755705477767,
        "tps":2229.9211421469063
    },{
        "id":"e51e9f749310276ab9703f7fee060428",
        "parallelism":16,
        "description":"Source: Source_member_cart_571 -> Parse_member_cart_571 -> MarkPartitionId_member_cart_571",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"2",
        "inputs":[],
        "delay":543.154579539551,
        "latency":0.03552229369454256,
        "tps":7315.654362099118
    },{
        "id":"7a36df305393ff3b14bd89202b4bc183",
        "parallelism":42,
        "description":"Source: Source_aplus_293 -> Parse_aplus_293 -> MarkPartitionId_aplus_293",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"3",
        "inputs":[],
        "delay":547.7930303893829,
        "latency":0.06861035255877446,
        "tps":3212.1075949580304
    },{
        "id":"2ee7a39ec2512c9d64ab5037764195a7",
        "parallelism":32,
        "description":"Source: Source_pre_antispam_merge -> Parse_pre_antispam_merge -> MarkPartitionId_pre_antispam_merge",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"4",
        "inputs":[],
        "delay":605.8416038710653,
        "latency":0.03499716287826755,
        "tps":8431.086962674863
    },{
        "id":"44214664264953a481526820a1ff81df",
        "parallelism":52,
        "description":"Source: Source_dwd_tb_trd_pay_ri_247 -> Parse_dwd_tb_trd_pay_ri_247 -> MarkPartitionId_dwd_tb_trd_pay_ri_247",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"5",
        "inputs":[],
        "delay":619.7676654554822,
        "latency":0.06856083069539724,
        "tps":5215.650628055518
    },{
        "id":"d1204a822419eac4c32821608aee8141",
        "parallelism":512,
        "description":"Source: Source_app_taobao_page_sys_246 -> Parse_app_taobao_page_sys_246 -> MarkPartitionId_app_taobao_page_sys_246",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"6",
        "inputs":[],
        "delay":749.2987332120526,
        "latency":0.04740494354064629,
        "tps":2107.65350018741
    },{
        "id":"2400d839e54ec466ff6126c42d9f24ec",
        "parallelism":3001,
        "description":"FilterEmptyShuffleKey -> JoinData -> future wait operator -> AccumulateItemFeature -> CombineRequests_HBaseSink -> Sink: HBaseSink",
        "vcore":2.0,
        "memory":11003.0,
        "topology_id":"7",
        "inputs":[
            {"num":"0","id":"51079cf65c9a38dac3086c2aa0596b48","exchange":"pipelined"},{"num":"1","id":"061abcbfd3f5323cef8be00e311a9796","exchange":"pipelined"},{"num":"2","id":"e51e9f749310276ab9703f7fee060428","exchange":"pipelined"},{"num":"3","id":"7a36df305393ff3b14bd89202b4bc183","exchange":"pipelined"},{"num":"4","id":"2ee7a39ec2512c9d64ab5037764195a7","exchange":"pipelined"},{"num":"5","id":"44214664264953a481526820a1ff81df","exchange":"pipelined"},{"num":"6","id":"d1204a822419eac4c32821608aee8141","exchange":"pipelined"}
        ],
        "delay":53.599054383080436,
        "latency":0.07500380808887504,
        "tps":1301.1116685507332
    }
    ]
};

var plan =
{
	"jid": "227a6c336c3addfba5b38892c83d3d3c",
	"name": "Async I/O Example",
	"nodes": [{
		"id": "e0c2ef4b6dbb44ed9c33c168f57be73d",
		"parallelism": 1,
		"operator": "",
		"operator_strategy": "",
		"description": "Keyed Aggregation -&gt; Sink: Unnamed",
		"inputs": [{
			"num": 0,
			"id": "1d0d2e8d48049291d53be1107285639d",
			"ship_strategy": "HASH",
			"exchange": "pipelined"
		}],
		"optimizer_properties": {},
		"latency": 32.12,
		"tps": 1.0,
		"topology_id": 1,
		"vcore": 1.0,
		"memory": 9.0
	}, {
		"id": "1d0d2e8d48049291d53be1107285639d",
		"parallelism": 1,
		"operator": "",
		"operator_strategy": "",
		"description": "Source: Custom Source -&gt; async wait operator -&gt; Flat Map",
		"optimizer_properties": {},
		"latency": 32.12,
		"tps": 1.0,
		"delay":561.5820072393678,
		"topology_id": 0,
		"vcore": 1.0,
		"memory": 9.0
	}]
}

var task_executor_overview =
{
	"tasks": [{
		"id": 0,
		"host": "test.host",
		"resource_id": "resource id",
		"rpc_address": "1.1.1.1:1111"
	}]
}

var task_executor_metrics =
{
	"jvm": [{
		"name": "numRecordsInPerSecond",
		"value": "1"
	}]
}
