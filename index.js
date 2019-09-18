const formidable = require('formidable')
const util = require('util')
const express = require('express')
const he = require('he')
const config = require('./config')

const app = express()

app.get('/', (req, res) => {
  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'})
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  )
})

app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm()
  form.maxFileSize = 4 * 1000 * 1000 * 1000

  form.on('fileBegin', function(name, file) {
    file.path = config.uploadDir + '/' + he.decode(file.name);
  })

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.write('received upload:\n\n')
    res.end(util.inspect({fields: fields, files: files}))
  })
})

app.listen(config.port, () => console.log(`App listening on port ${config.port}!`))
