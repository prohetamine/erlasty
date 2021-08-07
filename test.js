const express     = require('express')
    , app         = express()
    , erlasty     = require('./index')

const port = 3000
const config = {
  count: 7,
  interval: 500,
  timeout: 2000
}

const puppeteerConfig = {
  headless: true
}

app.use(erlasty.static(__dirname + '/app', port, config, puppeteerConfig))

app.listen(port)
