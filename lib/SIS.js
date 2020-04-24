const axios = require('axios')
const polling = require('async-polling')
const puppeteer = require('puppeteer')

const User = require('./User')
const Grades = require('./Grades')
const Balance = require('./Balance')
const Registration = require('./Registration')
const Curriculum = require('./Curriculum')

class SIS {
  constructor() {
    this.url = "https://sis2.addu.edu.ph"
    this.username = ''
    this.password = ''
    this.cookies = ''
    this.poll = null
    this.user = null
    this.browser = null
  }

  async init() {
    this.browser = await puppeteer.launch({
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
  }

  async login(username, password) {
    var loginPage = await this.browser.newPage()

    await loginPage.goto(this.url, { waitUntil: 'load', timeout: 0 })

    this.username = username
    this.password = password

    await loginPage.type("#edit-name", this.username)
    await loginPage.type("#edit-pass", this.password)
    await loginPage.click('#edit-submit')

    const rawCookies = await loginPage.cookies()

    loginPage.close()

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

    return this.user
  }

  async getUser() {
    if (this.cookies === '') {
      throw 'Authentication required. Please login first.'
    }

    return this.user
  }

  async getGrades() {
    if (this.cookies === '') {
      throw 'Authentication required. Please login first.'
    }

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
    if (this.cookies === '') {
      throw 'Authentication required. Please login first.'
    }

    var balancePage = await axios.get(`${this.url}/balance`, { 
      headers: {
        Cookie: this.cookies
      }
    })
    return new Balance(balancePage.data)
  }

  async getRegistration() {
    if (this.cookies === '') {
      throw 'Authentication required. Please login first.'
    }

    var registrationPage = await axios.get(`${this.url}/registration`, {
      headers: {
        Cookie: this.cookies
      }
    })
    return new Registration(registrationPage.data)
  }

  async getCurriculum() {
    if (this.cookies === '') {
      throw 'Authentication required. Please login first.'
    }
    
    var curriculumPage = await axios.get(`${this.url}/curriculum`, {
      headers: {
        Cookie: this.cookies
      }
    })
    return new Curriculum(curriculumPage.data)
  }

  close() {
    this.cookies = ''
    if (this.poll !== null) {
      this.poll.stop()
    }
    if (this.browser !== null) {
      this.browser.close()
    }
  }
}

module.exports = SIS