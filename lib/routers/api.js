var express = require('express')
var router = express.Router()
var fs = require('fs')

router.use((req, res, next) => {
  if (req.query.path) {
    req.fullpath = req.config.uploadDir + req.query.path
    if (!fs.existsSync(req.fullpath))
      res.jsonp('no such file or directory')
  }
  next();
})

router.get('/ls', (req, res) => {
  const list = fs.readdirSync(req.fullpath).map(x => {
    const res = {name:x}
    const stat = fs.statSync(req.fullpath + x)
    res.isDir = stat.isDirectory()
    res.isFile = stat.isFile()
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

router.get('/download', (req, res) => {
  if(fs.statSync(req.fullpath).isFile()) {
    res.sendFile(req.fullpath)
  } else {
    res.jsonp('not support download directory yet')
  }
})

module.exports = router
