var express = require('express');
var fs      = require('fs');
var app     = express();

app.get('/data.tsv',function(req,res) {
	fs.readFile('predict_result.tsv', function read(err, data) {
		if (err) {
			throw err;
		}
		content = 'date\tpositive\ttotal\n' + data;
		res.send(content);
});
    // return res.send("date	New York	San Francisco	Austin\n20111001	63.4	62.7	72.2\n20111002	58.0	59.9	67.7\n")
})

// set up the local server
app.use('/', express.static(__dirname+"/"));

console.log(__dirname)

app.listen(7777);
