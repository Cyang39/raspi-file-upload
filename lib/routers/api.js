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

router.get('/ls', (req, res, next) => res.jsonp(fs.readdirSync(req.fullpath)))
router.get('/stat', (req, res, next) => res.jsonp(fs.statSync(req.fullpath)))
router.get('/isFile', (req,res,next) => res.jsonp(fs.statSync(req.fullpath).isFile()))
router.get('/isDir', (req, res, next) => res.jsonp(fs.statSync(req.fullpath).isDirectory()))

router.get('/mkdir', (req, res, next) => {
  fs.mkdir(req.config.uploadDir + req.query.path, { recursive: true }, (err) => {
    if (err) res.jsonp(err)
    else res.jsonp('success')
  })
})

module.exports = router;
