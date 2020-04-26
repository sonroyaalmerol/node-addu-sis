(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  // TODO: prereq module for curriculum

  require('dotenv').config()

  const SIS = require('./index')

  const sis = new SIS({ cache: true })
  await sis.init()
  await sis.login(process.env.USERNAME, process.env.PASSWORD)

  /* var res = await Promise.all([
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
      console.log(grades[yearKey][semKey].all())
    })
  })

  console.log(balance.terms)
  console.log(registration.all())
  console.log(curriculum.all()) */

  console.log((await sis.getGrades()).all())
  console.log((await sis.getBalance()).all())
  console.log((await sis.getCurriculum()).all())
  console.log((await sis.getRegistration()).all())
  console.log((await sis.searchClass('4-%')))
  
  await sis.close()

})()
