const formidable = require('formidable')
const util = require('util')
const express = require('express')
const he = require('he')
const fs = require('fs')
const config = require('./config')

const app = express()


app.get('/', (req, res) => {
  res.writeHead(200, {'content-type': 'text/html'})
  const children = fs.readdirSync(config.uploadDir)
  const childrenDir = children.filter(x => !fs.statSync(config.uploadDir + '/' + x).isFile())
  const childrenFile = children.filter(x => fs.statSync(config.uploadDir + '/' + x).isFile())
  res.end(
    '<meta charset="utf-8" />'+
    `<ul>${childrenDir.map(x => '<li>📂<a href=' + x +'>' + x +'</a></li>').join('')}</ul>`+
    `<ul>${childrenFile.map(x => '<li>📃<a href=' + x +'>' + x +'</a></li>').join('')}</ul>`+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="path"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  )
})

app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm()
  form.maxFileSize = 4 * 1000 * 1000 * 1000

  form.on('field', function(name, value) {
    if(!value) value = config.uploadDir
    form.on('fileBegin', function(name, file) {
      file.path = value + '/' + he.decode(file.name);
    })
  });

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.write('received upload:\n\n')
    res.end(util.inspect({fields: fields, files: files}))
  })
})

app.listen(config.port, () => console.log(`App listening on port ${config.port}!`))
