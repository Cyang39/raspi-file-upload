const formidable = require('formidable')
const util = require('util')
const express = require('express')
const fs = require('fs')
const config = require('yargs')
  .alias('uploadDir', 'path')
  .argv

function decodeEntities(str) {
  return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}

const app = express()

const isUnderServerRoot = (path, root) => path.indexOf(root) === 0
const statSync = (path) => fs.statSync(decodeURIComponent(path), "utf8")
const readdirSync = (path) => fs.readdirSync(decodeURIComponent(path), "utf8")

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('*', express.static(config.uploadDir, { dotfiles: 'allow' }))

app.get('*', (req, res) => {
  const wholePath = config.uploadDir + req.path
  // is file
  if(statSync(wholePath).isFile()) {
    res.sendFile(decodeURIComponent(wholePath))
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
      file.path = config.uploadDir + value + '/' + decodeEntities(file.name);
    })
  });

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.write('received upload:\n\n')
    res.end(util.inspect({fields: fields, files: files}))
  })
})

// 删除文件
app.delete('/fs/*', (req, res) => {
  const target_path = config.uploadDir + req.path.substring(3)
  if(fs.existsSync(target_path) && statSync(target_path).isFile()) {
    fs.unlink(target_path, (err) => {
      if(err) console.log(err)
      res.end("删除成功")
    })
  } else {
    res.end('文件不存在，或者路径为文件夹')
  }
})

app.listen(config.port, () => console.log(`App listening on port ${config.port}!`))
