const formidable = require('formidable')
const http = require('http')
const util = require('util')
const express = require('express')

const app = express()
const port = 8080

app.get('/', (req, res) => {
  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  )
})

app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();

  form.uploadDir = "/Users/cyang/Desktop";
  form.maxFileSize = 4 * 1000 * 1000 * 1000;

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
