var express = require('express')
const formidable = require('formidable')
const util = require('util')
const t = require('../utils')
var router = express.Router()
var fs = require('fs')

router.use((req, res, next) => {
  if (req.query.path)
    req.fullpath = req.config.uploadDir + req.query.path
  next();
})

router.get('/ls', (req, res) => {
  const list = fs.readdirSync(req.fullpath).map(x => {
    const res = {name:x}
    const stat = fs.statSync(req.fullpath + x)
    res.isDir = stat.isDirectory()
    res.isFile = stat.isFile()
    res.size = stat.size
    return res
  })
  res.jsonp(list)
})

router.get('/mkdir', (req, res) => {
  fs.mkdir(req.config.uploadDir + req.query.path, { recursive: true }, (err) => {
    if (err) res.jsonp(err)
    else res.jsonp('success')
  })
})

router.get('/download', (req, res) => res.redirect('/api/download' + req.query.path))

router.post('/upload', (req, res) => {
  var form = new formidable.IncomingForm()
  form.maxFileSize = 4 * 1000 * 1000 * 1000

  form.on('fileBegin', function(name, file) {
    file.path = req.fullpath + t.decodeEntities(file.name);
  })

  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'})
    res.write('received upload:\n\n')
    res.end(util.inspect({fields: fields, files: files}))
  })
})

router.get('/delete', (req, res) => {
  if(!fs.statSync(req.fullpath).isFile()) {
    let size = fs.readdirSync(req.fullpath).length
    if(size !== 0) return res.jsonp('dir is not empty')
    else {
      fs.rmdirSync(req.fullpath)
      return res.jsonp('success')
    }
  }
  fs.unlinkSync(req.fullpath)
  res.jsonp('success')
})

router.get('/download/*', (req, res) => {
  const filepath = req.config.uploadDir + '/' + req.params[0]
  if(fs.statSync(filepath).isFile())
    res.sendFile(filepath)
  else
    res.jsonp('not support download directory yet')
})

module.exports = router
