const express     = require('express')
    , app         = express()
    , erlasty     = require('./index')

const port = 3000

app.use(erlasty.static(__dirname + '/app/build', port))

app.listen(port)
