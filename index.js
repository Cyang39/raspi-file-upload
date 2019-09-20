const formidable = require('formidable')
const util = require('util')
const express = require('express')
const he = require('he')
const fs = require('fs')
const config = require('./config')

const app = express()

const isUnderServerRoot = (path, root) => path.indexOf(root) === 0
const statSync = (path) => fs.statSync(decodeURIComponent(path), "utf8")
const readdirSync = (path) => fs.readdirSync(decodeURIComponent(path), "utf8")

app.get('*', express.static(config.uploadDir, { hidden: true }))

app.get('*', (req, res) => {
  const wholePath = config.uploadDir + req.path
  // is file
  if(statSync(wholePath).isFile()) {
    res.sendfile(decodeURIComponent(wholePath))
    return
  }
  // is folder
  const children = readdirSync(wholePath)
  const childrenDir = children.filter(x => !statSync(wholePath + '/' + x).isFile())
  const childrenFile = children.filter(x => statSync(wholePath + '/' + x).isFile())

  res.writeHead(200, {'content-type': 'text/html'})
  res.end(
    '<meta charset="utf-8" />'+
    `<ul>${childrenDir.map(x => '<li>【文件夹】 <a href="' + req.path + x + '/">' + x +'</a></li>').join('')}</ul>`+
    `<ul>${childrenFile.map(x => '<li>【文件】  <a href="'+ req.path +  x + '" target="_blank">' + x +'</a></li>').join('')}</ul>`+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="path" value="'+ decodeURIComponent(req.path) +'" readonly><br>'+
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
      file.path = config.uploadDir + value + '/' + he.decode(file.name);
    })
  });

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.write('received upload:\n\n')
    res.end(util.inspect({fields: fields, files: files}))
  })
})

app.listen(config.port, () => console.log(`App listening on port ${config.port}!`))
