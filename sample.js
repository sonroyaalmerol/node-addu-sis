(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  // TODO: prereq module for curriculum

  require('dotenv').config()

  const SIS = require('./index')

  const sis = new SIS(process.env.USERNAME, process.env.PASSWORD)

  /* var res = await Promise.all([
    sis.getUser(),
    sis.getGrades(),
    sis.getBalance(),
    sis.getRegistration(),
    sis.getCurriculum(),
    sis.searchClassOfferings('4-%')
  ])

  var user = res[0]
  var grades = res[1]
  var balance = res[2]
  var registration = res[3]
  var curriculum = res[4]
  var search = res[5]

  console.log(user.all())
  console.log(grades.all())
  console.log(balance.all())
  console.log(registration.all())
  console.log(curriculum.all())
  console.log(search.all()) */

  var prereg = await sis.getPrereg()
  console.log(prereg.all())

  /* const nodeFetch = require('node-fetch')
  const fetch = require('fetch-cookie/node-fetch')(nodeFetch)

  const qs = require('querystring')

  const data = {
    name: 'sonraalmerol',
    pass: 'AdDU2201901285413',
    form_id: 'user_login_block',
    op: 'Log in'
  }
  var x = await fetch(`https://sis2.addu.edu.ph/node?destination=node`, { 
    method: 'POST',
    body: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(await x.text()) */
})()
