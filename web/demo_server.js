var express = require('express');
var fs      = require('fs');
var app     = express();

app.get('/data.tsv',function(req,res) {
	fs.readFile('predict_result.tsv', function read(err, data) {
		if (err) {
			throw err;
		}
		content = 'date\tretented_user\ttotal_user\n' + data;
		res.send(content);
    });
})

// set up the local server
app.use('/', express.static(__dirname+"/"));

console.log(__dirname)

app.listen(7777);
