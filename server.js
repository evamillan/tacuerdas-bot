const express = require('express')
const puppeteer = require('puppeteer')
const twitter = require('./twitter.js')
const {
  dates,
  directories,
  blogs,
  puppeteerOptions,
  screenshotOptions
} = require('./constants.js')

const app = express()

const getRandomBlogList = () => {
  const randomDate = dates[Math.floor(Math.random() * dates.length)]
  const randomDirectory = directories[Math.floor(Math.random() * directories.length)]
  console.log(randomDirectory)
  return `https://web.archive.org/web/${randomDate}/http://bitacoras.net:80/dir/${randomDirectory}`
}

const getRandomBlog = () => {
  const randomDate = dates[Math.floor(Math.random() * dates.length)]
  const randomBlog = blogs[Math.floor(Math.random() * blogs.length)]
  return `https://web.archive.org/web/${randomDate}/${randomBlog}`
}

const getCurrentUrl = () => {
  const waybackHeader = document.querySelector('#wm-ipp-base')
  const url = document.querySelector('#wmtbURL') ? document.querySelector('#wmtbURL').value : ''
  waybackHeader.style.display = 'none'
  console.log(url)
  return url
}

const getBlogsUrls = () => {
  const elements = document.querySelectorAll('table:nth-child(6) > tbody > tr > td:nth-child(1) > p > span > a:first-child')
  return [...elements].map(item => item.getAttribute("href"))
}

app.all("/tuitear", function (req, res) {
  (async () => {
    const browser = await puppeteer.launch(puppeteerOptions)
    const newPage = await browser.newPage()
    await newPage.goto(getRandomBlogList(), { waitUntil: 'load', timeout: 100000 }).catch(error => {
      console.log(error)
      browser.disconnect()
      res.status(500).send({'error': error})
      return
    })
    const blogUrls = await newPage.evaluate(getBlogsUrls).catch(error => {
      console.log(error)
      browser.disconnect()
      res.status(500).send({'error': error})
      return
    })
    await newPage.goto(blogUrls[Math.floor(Math.random() * blogUrls.length)], { waitUntil: 'load', timeout: 10000 }).catch(error => {
      console.log(error)
      browser.disconnect()
      res.send({'error': error})
      return
    })
    await newPage.waitFor(30000)
    const url = await newPage.evaluate(getCurrentUrl).catch(error => {
        console.log(error)
        browser.disconnect()
        res.status(500).send({'error': error})
        return
      })
    await newPage.screenshot(screenshotOptions).then(response => {
      twitter.post_image(url, response, function(error, data) {
        if (error) {
          console.log(error)
          browser.disconnect()
          res.status(500).send({'error': error})
        } else {
          browser.disconnect()
          browser.close()
          res.send({'OK': url})
        }
      })
    })
  })()
})

const listener = app.listen(3000, function () {
  console.log('Bot running on port ' + listener.address().port);
})
