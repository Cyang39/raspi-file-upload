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
app.set('view engine', 'pug')
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('*', express.static(config.uploadDir, { dotfiles: 'allow' }))
app.get('/', (req, res) => res.redirect('/fs/'))

app.all('/fs/*', (req, res, next) => {
  req.target = decodeURIComponent(req.path.substring(3))
  req.file_path = config.uploadDir + req.target
  next()
})

app.get('/fs/*', function (req, res) {
  // 文件不存在
  if(!fs.existsSync(req.file_path)) {
    res.render('error', {message: `No such file or folder "${req.target}"`})
    return
  }
  // 删除文件
  if(req.query.operate === 'delete' || req.query.operate === 'del') {
    if(!fs.statSync(req.file_path).isFile()) return res.render('error', {message: `目前无法删除目录`})
    fs.unlinkSync(req.file_path)
    return res.redirect('./')
  }
  // 下载文件
  if(fs.statSync(req.file_path).isFile()) {
    res.sendFile(req.file_path)
    return
  }
  // 进入目录
  if(req.path[req.path.length - 1] !== '/') return res.redirect(req.path + '/')

  const children = fs.readdirSync(req.file_path)
    .map(x => fs.statSync(req.file_path+x).isFile() ? {name:x,type:"file",url:req.path+x} : {name:x,type:"dir",url:req.path+x})
  res.render('index', { title: req.target, list: children })
})

// 上传文件
app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm()
  form.maxFileSize = 4 * 1000 * 1000 * 1000

  form.on('field', function(name, value) {
    if(!value) value = config.uploadDir
    form.on('fileBegin', function(name, file) {
      file.path = config.uploadDir + value + decodeEntities(file.name);
    })
  });

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.write('received upload:\n\n')
    res.end(util.inspect({fields: fields, files: files}))
  })
})

app.listen(config.port)
