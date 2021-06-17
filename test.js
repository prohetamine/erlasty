const express     = require('express')
    , app         = express()
    , erlasty     = require('./index')

const port = 3000
const config = {
  count: 7,
  interval: 500,
  timeout: 2000
}

app.use(erlasty.static(__dirname + '/app/build', port, config))

app.listen(port)
