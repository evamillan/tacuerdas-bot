const puppeteer = require('puppeteer');

const getRandomBlogList = () => {
  const dates = [
    '20021011093336',
    '20030401081030',
    '20030604143324',
  ];

  const directories = [
    'Arte_y_Cultura',
    'Internet_y_Tecnologia',
    'Personales',
    'Temáticos'
  ];

  let randomDate = dates[Math.floor(Math.random() * dates.length)];
  let randomDirectory = directories[Math.floor(Math.random() * directories.length)];

  return 'https://web.archive.org/web/' + randomDate + '/http://bitacoras.net:80/dir/' + randomDirectory;
}

async function scrape() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  var randomListing = getRandomBlogList();
  await page.goto(randomListing);

  const getBlogsUrls = await page.evaluate(() => {
    let urls = [];
    let elements = document.querySelectorAll('table:nth-child(10) > tbody > tr > td:nth-child(1) > p > span > a:nth-child(1)');

    for (let i = 0; i < elements.length; i++) {
      let url = elements[i].getAttribute("href");

      urls.push(url);
    }
    console.log(urls);
  });
  await page.waitFor(1000);
}

scrape()
