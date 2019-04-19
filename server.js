var express = require('express');
var fs = require('fs')
var app = express();
let port = process.env.PORT;

app.use(express.static('public'));

if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => console.log('Node server listening on port ' + port));

