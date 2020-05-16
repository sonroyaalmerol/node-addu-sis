(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  // TODO: prereq module for curriculum

  require('dotenv').config()

  const SIS = require('./index')

  const sis = new SIS(process.env.USERNAME, process.env.PASSWORD)

  var isValid = await sis.checkAuth()

  console.log(isValid)

  //var prereg = await sis.getUser()
  //console.log(prereg.all())

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
