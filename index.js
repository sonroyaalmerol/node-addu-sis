(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  // TODO: find method for curriculum, grades, registrations
  // TODO: prereq module for curriculum

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

  var res = await Promise.all([
    sis.getUser(),
    sis.getGrades(),
    sis.getBalance(),
    sis.getRegistration(),
    sis.getCurriculum()
  ])

  var user = res[0]
  var grades = res[1]
  var balance = res[2]
  var registration = res[3]
  var curriculum = res[4]
  
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

  Object.keys(grades).forEach(yearKey => {
    Object.keys(grades[yearKey]).forEach(semKey => {
      console.log(grades[yearKey][semKey].getArray())
    })
  })

  console.log(balance.terms)
  console.log(registration.getArray())
  console.log(curriculum.getArray())

  await sis.close()
  browser.close()

})()
