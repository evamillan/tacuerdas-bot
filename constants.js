const dates = [
  '20021011093336',
  '20021128140618',
  '20021208090812',
  '20030202181344',
  '20030401081030',
  '20030604143324',
]

const directories = [
  'Internet_y_Tecnologia',
  'Internet_y_Tecnologia/Enlaces',
  'Internet_y_Tecnologia/Opinion',
  'Internet_y_Tecnologia/Usabilidad',
  'Temáticos',
  'Tematicos/Grupales',
  'Tematicos/Periodismo',
  'Arte_y_Cultura',
  'Arte_y_Cultura/Ficcion',
  'Personales',
  'Personales/Diarios',
  'Personales/Opinion'
]

const blogs = [
  'http://delia2d.com:80/',
  'http://huevoluciona.com:80/',
  'http://jaime.antville.org:80/',
  'http://elhombrequecomiadiccionarios.com:80/',
  'http://estrambotica.com:80/',
  'http://egoismo.com:80/',
  'http://www.sonrisadetequila.enk3.com:80',
  'http://inered.net:80/',
  'http://www.kittenaz.net:80/',
  'http://vanity.lifefromthenet.com:80/',
  'http://arkania.org:80/~antidepresivos/',
  'http://thefire.f2o.org:80/index.html',
  'http://rare.bulletrain.net:80/',
  'http://ruido.enk3.com:80/',
  'http://pain.antville.org:80/',
  'http://spot.antville.org:80/',
  'http://www.iespana.es:80/bradomin/blogger.htm',
  'http://www.4colors.net:80/',
  'http://www.sakura-saku.org:80/',
  'http://www.jamillan.com:80/blog2.htm',
  'http://fliposo.hypermart.net:80/',
  'http://www.insolencia.com:80/',
  'http://www.poesiamalvada.com:80/makeme.htm',
  'http://www.efetepe.org:80/',
  'http://lenypiensaymira.com:80/',
  'http://ego.greenshines.com:80/',
  'http://www.tensiondigital.com:80/',
  'http://www.fluzo.net',
  'http://neurasthenic.bulletrain.net/turpentine:80/'
]

const puppeteerOptions = {
  args: ['--no-sandbox'],
  headless: true,
  defaultViewport: {
    width: 800,
    height: 800
  }
}

const screenshotOptions = {
  clip: {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  },
  encoding: 'base64'
}

module.exports = {
  dates,
  directories,
  blogs,
  puppeteerOptions,
  screenshotOptions
}
