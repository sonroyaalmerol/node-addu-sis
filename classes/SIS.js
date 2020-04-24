const axios = require('axios')
const polling = require('async-polling')

const User = require('./User')
const Grades = require('./Grades')
const Balance = require('./Balance')
const Registration = require('./Registration')
const Curriculum = require('./Curriculum')

class SIS {
  constructor(username, password) {
    this.url = "https://sis2.addu.edu.ph"
    this.username = username
    this.password = password
    this.cookies = ''
    this.poll = null
    this.user = null
  }

  async init(browser) {
    var page = await browser.newPage()

    await page.goto(this.url, { waitUntil: 'load', timeout: 0 })
    await page.type("#edit-name", this.username)
    await page.type("#edit-pass", this.password)
    await page.click('#edit-submit')

    const rawCookies = await page.cookies()

    page.close()

    rawCookies.forEach((cookie) => {
      this.cookies = this.cookies + `${cookie.name}=${cookie.value}; `
    })

    // Prevent cookie expiring
    this.poll = polling(async (end) => {
      await axios.get(`${this.url}/node`, { 
        headers: {
          Cookie: this.cookies
        }
      })
      end()
    }, 180000)
    
    var registration = await axios.get(`${this.url}/registration`, { 
      headers: {
        Cookie: this.cookies
      }
    })

    this.user = new User(registration.data)
  }

  async getUser() {
    return this.user
  }

  async getGrades() {
    var currentYear = new Date().getFullYear()
    var june = new Date(`06-01-${currentYear}`)
    var today = new Date()
    today.setHours(0,0,0,0)

    var yearsToCheck = []
    
    for (var x = 0; x <= this.user.year; x++) {
      if (today < june && x === 0) {
        continue
      }
      yearsToCheck.push(currentYear - x)
    }

    var grades = {}

    await Promise.all(yearsToCheck.map(async (year) => {
      var yearGrade = {}
      await Promise.all([0, 1, 2].map(async (i) => {
        var semGrade = await axios.get(`${this.url}/grades/${i+1}/${year}`, { 
          headers: {
            Cookie: this.cookies
          }
        })
        if (i === 0) {
          yearGrade.firstSem = new Grades(semGrade.data)
        } else if (i === 1) {
          yearGrade.secondSem = new Grades(semGrade.data)
        } else if (i === 2) {
          yearGrade.summer = new Grades(semGrade.data)
        }
      }))
      grades[`${year}-${year+1}`] = yearGrade
    }))

    return grades
  }

  async getBalance() {
    var balancePage = await axios.get(`${this.url}/balance`, { 
      headers: {
        Cookie: this.cookies
      }
    })
    return new Balance(balancePage.data)
  }

  async getRegistration() {
    var registrationPage = await axios.get(`${this.url}/registration`, {
      headers: {
        Cookie: this.cookies
      }
    })
    return new Registration(registrationPage.data)
  }

  async getCurriculum() {
    var curriculumPage = await axios.get(`${this.url}/curriculum`, {
      headers: {
        Cookie: this.cookies
      }
    })
    return new Curriculum(curriculumPage.data)
  }

  close() {
    this.cookies = ''
    this.poll.stop()
  }
}

module.exports = SIS