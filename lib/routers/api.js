var express = require('express')
var router = express.Router()
var fs = require('fs')

router.get('/ls', (req, res, next) => {
  res.send(req.query)
})

router.get('/mkdir', (req, res, next) => {
  fs.mkdir(req.config.uploadDir + req.query.path, { recursive: true }, (err) => {
    if(err) res.send(err)
    else res.send('success')
  })
})

module.exports = router;
