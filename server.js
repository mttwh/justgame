var express = require('express');
var fs = require('fs')
var app = express();
var port = 5000

eval(fs.readFileSync('./public/dedalus.js').toString());
eval(fs.readFileSync('./public/dedalus-web.js').toString());

app.use(express.static('public'));
app.listen(port, () => console.log('Node server listening on port ' + port));