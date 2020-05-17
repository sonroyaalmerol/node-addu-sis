(async () => {
  // SAMPLE CODE USING THE LIBRARY

  // PRINTS USER INFO AND ALL GRADES

  // TODO: prereq module for curriculum

  require('dotenv').config()

  const SIS = require('./index')

  const sis = new SIS(process.env.USERNAME, process.env.PASSWORD)

  var res = await Promise.all([
    //sis.getBalance(),
    //sis.getCurriculum(),
    //sis.getGrades(),
    //sis.getPrereg(),
    sis.getRegistration(),
    sis.getUser()
  ])

  for (var i=0; i < res.length; i++) {
    console.log(res[i].all())
  }
})()
