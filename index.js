const express = require('express')
const config = require('yargs')
  .alias('uploadDir', 'path')
  .argv

// 默认配置
config.uploadDir = config.uploadDir || __dirname
config.port = config.port || 8080

const app = express()

// process
app.use((req, res, next) => {
  req.config = res.config = config
  next();
})

app.get('/*', express.static(__dirname + '/static'))

app.use('/api', require('./lib/routers/api'))

app.listen(config.port)
