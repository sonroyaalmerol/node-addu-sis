(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  require('dotenv').config()

  const puppeteer = require('puppeteer')
  const SIS = require('./classes/SIS')

  var browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
