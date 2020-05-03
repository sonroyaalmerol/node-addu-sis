const axios = require('axios')
const tabletojson = require('tabletojson').Tabletojson
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const NodeCache = require('node-cache')
const http = require('http')
const https = require('https')
const qs = require('querystring')
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')

const User = require('./User')
const Grades = require('./Grades')
const Balance = require('./Balance')
const Registration = require('./Registration')
const Curriculum = require('./Curriculum')

class SIS {

  #url
  #username
  #password
  #cookieJar
  #poll
  #browser
  #cache

  constructor({ cache, url }) {
    axiosCookieJarSupport(axios)
    axios.defaults.withCredentials = true

    if (typeof url === String) {
      this.#url = url
    } else if (typeof url === Array) {
      this.#url = url[Math.floor(Math.random() * Math.floor(url.length))]
    } else {
      this.#url = 'https://sis2.addu.edu.ph'
    }
    this.#username = ''
    this.#password = ''
    this.#cookieJar = new tough.CookieJar()
    this.#poll = null
    this.#browser = null
    if (cache) {
      this.#cache = new NodeCache({ stdTTL: 60, checkperiod: 60 })
    } else {
      this.#cache = null
    }
    this._setCache = (name, value, ttl) => {
      if (cache) {
        if (!ttl) {
          return this.#cache.set(`${this.#username}$${this.#password}$${name}`, value)
        } else {
          return this.#cache.set(`${this.#username}$${this.#password}$${name}`, value, ttl)
        }
      } else {
        return null
      }
    }
    this._getCache = (name) => {
      if (cache) {
        return this.#cache.get(`${this.#username}$${this.#password}$${name}`)
      } else {
        return null
      }
    }
    this._request = async (url) => {
      try {
        const httpAgent = new http.Agent({ keepAlive: true })
        const httpsAgent = new https.Agent({ keepAlive: true })
        var x = await axios.get(`${this.#url}${url}`, { 
          jar: this.#cookieJar,
          withCredentials: true,
          httpAgent,
          httpsAgent
        })
        return x
      } catch (err) {
        if (err.response.status === 403) {
          this.#cookieJar = new tough.CookieJar()
          this.#cache.del(`${this.#username}$${this.#password}$cookies`)
          throw new Error('Authentication token expired! Please login again.')
        } else if (err.response.status === 408 || err.code === 'ECONNABORTED' || err.response.status === 500) {
          throw new Error('AdDU SIS Server Timeout.')
        }
        return null
      }
    }
  }

  async login(username, password) {
    try {
      const data = {
        name: username,
        pass: password,
        form_id: 'user_login_block',
        op: 'Log in'
      }

      var x = await axios.post(`${this.#url}/node?destination=node`, qs.stringify(data), {
        jar: this.#cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

    } catch (err) {
      throw new Error('AdDU SIS Server Timeout.')
    }
    
  }

  async getUser() {
    var data = this._getCache('registration')
    if (!data) {
      var registration = await this._request(`/registration`)
      if (registration) {
        data = registration.data
        this._setCache('registration', registration.data)
      }
    }

    return new User(data)
  }

  async getGrades() {
    var allGrades = this._getCache('grades')
    if (!allGrades) {
      allGrades = []
      const prevPage = async (sem, year) => {
        var page = await this._request(`/grades/${sem}/${year}`)
        if (page) {
          allGrades.push(page.data)
          var dom = new JSDOM(page.data)
          var _sem = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(7)").value
          var _year = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(8)").value

          if (_sem && _year) {
            await prevPage(_sem, _year)
          }
        }
      }

      var latest = await this._request(`/grades`)
      if (latest) {
        allGrades.push(latest.data)

        var dom = new JSDOM(latest.data)
        var _sem = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(7)").value
        var _year = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(8)").value

        if (_sem && _year) {
          await prevPage(_sem, _year)
        }

        this._setCache('grades', allGrades)
      }
    }

    return new Grades(allGrades)
  }

  async getBalance() {
    var allBalance = this._getCache('balance')
    if (!allBalance) {
      allBalance = []
      const prevPage = async (sem, year, period) => {
        var page = await this._request(`/balance/${sem}/${year}/${period}`)
        if (page) {
          allBalance.push(page.data)
          var dom = new JSDOM(page.data)
          var _sem = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(9)").value
          var _year = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(10)").value
          var _period = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(11)").value

          if (_sem && _year && _period) {
            await prevPage(_sem, _year, _period)
          }
        }
      }

      var latest = await this._request(`/balance`)
      if (latest) {
        allBalance.push(latest.data)

        var dom = new JSDOM(latest.data)
        var _sem = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(9)").value
        var _year = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(10)").value
        var _period = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(11)").value

        if (_sem && _year && _period) {
          await prevPage(_sem, _year, _period)
        }

        this._setCache('balance', allBalance)
      }
    }

    return new Balance(allBalance)
  }

  async getRegistration() {
    var data = this._getCache('registration')
    if (!data) {
      var registrationPage = await this._request(`/registration`)
      if (registrationPage) {
        data = registrationPage.data
        this._setCache('registration', registrationPage.data)
      }
    }
    return new Registration(data)
  }

  async getCurriculum() {
    var data = this._getCache('curriculum')
    if (!data) {
      var curriculumPage = await this._request(`/curriculum`)
      if (curriculumPage) {
        data = curriculumPage.data
        this._setCache('curriculum', curriculumPage.data)
      }
    }
    return new Curriculum(data)
  }

  async searchClass(classCode) {
    var toReturn = this._getCache(`search$${classCode}`)
    if (!toReturn) {
      const dom = new JSDOM((await this._request(`/search_subjects`)).data)

      const input = {
        classcode: classCode,
        form_id: 'inquiry_form',
        form_token: dom.window.document.querySelector("#inquiry-form > div > input[type=hidden]:nth-child(3)").value, 
        op: 'Search'
      }

      var x = await axios.post(`${this.#url}/search_subjects`, qs.stringify(input), {
        jar: this.#cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      const data = tabletojson.convert(x.data)[0]

      toReturn = []
      for (var i = 0; i < data.length; i++) {
        var cleanSubj = {}
        cleanSubj.code = data[i]['CODE']
        cleanSubj.name = data[i]['SUBJECT']
        cleanSubj.description = data[i]['DESCRIPTION']
        cleanSubj.schedule = data[i]['SCHEDULE']
        cleanSubj.division = data[i]['DIVISION']
        cleanSubj.availableSlots = parseInt(data[i]['A'])
        cleanSubj.totalSlots = parseInt(data[i]['S'])
        cleanSubj.reservedSlots = parseInt(data[i]['R'])
        cleanSubj.enrolledSlots = parseInt(data[i]['E'])
        cleanSubj.teacher = data[i]['TEACHER']

        toReturn.push(cleanSubj)

        this._setCache(`search$${classCode}`, toReturn)
      }
    }
    return toReturn
  }

  close() {
    if (this.#poll !== null) {
      this.#poll.stop()
    }
    if (this.#browser !== null) {
      this.#browser.close()
    }
    if (this.#cache) {
      this.#cache.flushAll()
      this.#cache.close()
    }
  }
}

module.exports = SIS