(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  require('dotenv').config()

  const puppeteer = require('puppeteer')
  const SIS = require('./classes/SIS')

  var browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-canvas-aa', 
      '--disable-2d-canvas-clip-aa',
      '--disable-gl-drawing-for-tests',
      '--disable-dev-shm-usage',
      '--no-zygote',
      '--use-gl=desktop',
      '--enable-webgl',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-first-run',
      '--disable-infobars',
      '--disable-breakpad',
      '--user-data-dir=./chromeData',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  const sis = new SIS(process.env.USERNAME, process.env.PASSWORD)
  await sis.init(browser)
  var user = await sis.getUser()
  
  console.log({
    card: user.card,
    id: user.id,
    name: user.name,
    course: user.course,
    section: user.section,
    division: user.division,
    year: user.year,
    status: user.status
  })

  var grades = await sis.getGrades()

  Object.keys(grades).forEach(yearKey => {
    Object.keys(grades[yearKey]).forEach(semKey => {
      console.log(grades[yearKey][semKey].clean)
    })
  })

  await sis.close()
  browser.close()

})()
