const express       = require('express')
    , puppeteer     = require('puppeteer')
    , fs            = require('fs')
    , findAllFiles  = require('./lib/find-all-files')
    , isBot  = require('./lib/is-bot')

module.exports.static = (
  path,
  port,
  {
    isProtection = true,
    count = 7,
    interval = 500,
    timeout = 10000
  } = {
    isProtection: true,
    count: 7,
    interval: 500,
    timeout: 10000
  }
) => {
  let counter = 0
  let isTimeout = false

  setInterval(() => {
    counter = 0
  }, interval)

  const files = findAllFiles(path)

  return async (req, res, next) => {
    const normalizeFile = req.url === '/' ? '/' : req.url.replace(/\/$/, '').match(/([^\/]+|\/)$/gi)[0]
        , isIndex = !files.includes(normalizeFile)

    const pureStatic = () => {
      if (!isIndex) {
        express.static(path)(req, res, next)
      } else {
        express.static(path)({ ...req, url: '/' }, res, next)
      }
    }

    if (isBot(req.headers['user-agent']) && isIndex) {
      if (isProtection) {
        if (isTimeout) {
          pureStatic()
          return
        }

        counter++
        if (counter > count) {
          isTimeout = true
          setTimeout(() => {
            isTimeout = false
          }, timeout)
          pureStatic()
          return
        }
      }

      try {
        const browser = await puppeteer.launch({ headless: true })
            , page = await browser.newPage()
        await page.goto(`http://localhost:${port}` + req.url)
        const innerHTML = await page.evaluate(() => document.querySelector('html').innerHTML)
        res.end(innerHTML.replace(/<script[^<]+<\/script>/, ''))
        await browser.close()
      } catch (e) {
        express.static(path)(req, res, next)
      }
    } else {
      pureStatic()
    }
  }
}
