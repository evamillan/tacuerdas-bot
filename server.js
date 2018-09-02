const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');
const twitter = require(__dirname + '/twitter.js');

const app = express();

const dates = [
  '20021011093336',
  '20030202181344',
  '20030401081030',
  '20030604143324',
];

const directories = [
  'Arte_y_Cultura',
  'Arte_y_Cultura/Ficcion',
  'Personales',
  'Personales/Diarios',
  'Personales/Opinion',
  'Internet_y_Tecnologia',
  'Internet_y_Tecnologia/Enlaces',
  'Internet_y_Tecnologia/Opinion',
  'Internet_y_Tecnologia/Usabilidad',
  'Temáticos',
  'Tematicos/Grupales',
  'Tematicos/Periodismo'
];

const screenshotOptions = {
  clip: {
    x: 0,
    y: 0,
    width: 800,
    height: 800
  },
  encoding: 'base64'
};

const getRandomBlogList = () => {
  let randomDate = dates[Math.floor(Math.random() * dates.length)];
  let randomDirectory = directories[Math.floor(Math.random() * directories.length)];
  return 'https://web.archive.org/web/' + randomDate + '/http://bitacoras.net:80/dir/' + randomDirectory;
};

app.all("/" + process.env.BOT_ENDPOINT, (req, res) => {
  async function scrape() {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
      defaultViewport: {
        width: 800,
        height: 800
      }
    });

    const page = await browser.newPage();

    var randomListing = getRandomBlogList();
    await page.goto(randomListing).catch(error => {
      console.log(error);
      browser.close();
      scrape();
    });

    const getBlogsUrls = await page.evaluate(() => {
      let urls = [];
      let elements = document.querySelectorAll('table:nth-child(10) > tbody > tr > td:nth-child(1) > p > span > a:nth-child(1)');

      for (let i = 0; i < elements.length; i++) {
        let url = elements[i].getAttribute("href");

        urls.push(url);
      }
      return urls;
    })

    await page.waitFor(1000);
    await page.goto(getBlogsUrls[Math.floor(Math.random() * getBlogsUrls.length)]).catch(error => {
      console.log(error);
      browser.disconnect();
      scrape();
    });

    await page.waitFor(30000);

    const url = await page.evaluate(() => {
      const waybackHeader = document.querySelector('#wm-ipp');
      const url = document.querySelector('#wmtbURL').value;
      const trimmedUrl = url.slice(0, url.length - 4)
      waybackHeader.style.display = 'none';
      return url;
    }).catch(error => {
      console.log(error);
      browser.disconnect();
      scrape();
    });

    await page.screenshot(screenshotOptions).then(response => {
      twitter.post_image(url, response, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          browser.disconnect();
          browser.close();
          return;
        }
      });
    });
   res.send({'url': url});
   browser.close();
  }

  scrape();
});

var listener = app.listen(process.env.PORT, function() {
  console.log('Bot running on port ' + listener.address().port);
});
