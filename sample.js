(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  // TODO: prereq module for curriculum

  require('dotenv').config()

  const SIS = require('./index')

  const sis = new SIS(process.env.USERNAME, process.env.PASSWORD)

  var prereg = await sis.searchPrereg('ASF')
  console.log(prereg.response.all())
})()
