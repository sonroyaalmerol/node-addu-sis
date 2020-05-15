const axios = require('axios')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const qs = require('querystring')

const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')

const User = require('./models/User')
const Grades = require('./models/Grades')
const Balance = require('./models/Balance')
const Registration = require('./models/Registration')
const Curriculum = require('./models/Curriculum')
const SearchResult = require('./models/SearchResult')
const PreregList = require('./models/PreregList')
const PreregSearchResult = require('./models/PreregSearchResult')

class SIS {

  #url
  #username
  #password

  constructor(username, password, options) {
    axiosCookieJarSupport(axios)
    axios.defaults.withCredentials = true
    options = options || {}
    if ('url' in options) {
      if (typeof options.url === Array) {
        this.#url = options.url[Math.floor(Math.random() * Math.floor(url.length))]
      } else {
        this.#url = options.url
      }
    } else {
      this.#url = 'https://sis2.addu.edu.ph'
    }
    this.#username = username
    this.#password = password
  }

  async _request(url) {
    if (url === null) throw new Error('URL is required.') 

    try {
      const data = {
        name: this.#username,
        pass: this.#password,
        form_id: 'user_login_block',
        op: 'Log in'
      }
      
      var cookieJar = new tough.CookieJar()

      var x = await axios.post(`${this.#url}/node?destination=${url}`, qs.stringify(data), { 
        jar: cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      return { response: x, cookieJar }
    } catch (err) {
      if (typeof err === 'object') {
        if ('response' in err) {
          if (err.response.status === 403) {
            throw new Error('Invalid Username and Password! Please login again.')
          } else if (err.response.status === 408 || err.code === 'ECONNABORTED' || err.response.status === 500) {
            throw new Error('AdDU SIS Server Timeout.')
          }
        }
      }
      return null
    }
  }

  async getUser() {
    var registration = (await this._request(`/registration`)).response
    if (registration) {
      var data = registration.data
    }

    return new User(data)
  }

  async getGrades() {
    var allGrades = []
    const prevPage = async (sem, year, cookieJar) => {
      try {
        var page = await axios.get(`${this.#url}/grades/${sem}/${year}`, {
          jar: cookieJar,
          withCredentials: true
        })
        if (page) {
          allGrades.push(page.data)
          var dom = new JSDOM(page.data)
          var _sem = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(7)").value
          var _year = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(8)").value

          if (_sem && _year) {
            await prevPage(_sem, _year, cookieJar)
          }
        }
      } catch (err) {
        return null
      }
    }

    var latestPage = await this._request(`grades`)
    var latest = latestPage.response
    if (latest) {
      allGrades.push(latest.data)

      var dom = new JSDOM(latest.data)
      var _sem = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(7)").value
      var _year = dom.window.document.querySelector("#view-grade-form > div > stron > input[type=hidden]:nth-child(8)").value

      if (_sem && _year) {
        await prevPage(_sem, _year, latestPage.cookieJar)
      }
    }

    return new Grades(allGrades)
  }

  async getBalance() {
    var allBalance = []
    const prevPage = async (sem, year, period, cookieJar) => {
      try {
        var page = await axios.get(`${this.#url}/balance/${sem}/${year}/${period}`, {
          jar: cookieJar,
          withCredentials: true
        })
        if (page) {
          allBalance.push(page.data)
          var dom = new JSDOM(page.data)
          var _sem = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(9)").value
          var _year = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(10)").value
          var _period = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(11)").value

          if (_sem && _year && _period) {
            await prevPage(_sem, _year, _period, cookieJar)
          }
        }
      } catch (err) {
        return null
      }
    }

    var latestPage = await this._request(`balance`)
    var latest = latestPage.response
    if (latest) {
      allBalance.push(latest.data)

      var dom = new JSDOM(latest.data)
      var _sem = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(9)").value
      var _year = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(10)").value
      var _period = dom.window.document.querySelector("#view-balance-form > div > input[type=hidden]:nth-child(11)").value

      if (_sem && _year && _period) {
        await prevPage(_sem, _year, _period, latestPage.cookieJar)
      }
    }

    return new Balance(allBalance)
  }

  async getRegistration() {
    var registrationPage = (await this._request(`registration`)).response
    if (registrationPage) {
      var data = registrationPage.data
    }

    return new Registration(data)
  }

  async getCurriculum() {
    var curriculumPage = (await this._request(`curriculum`)).response
    if (curriculumPage) {
      var data = curriculumPage.data
    }

    return new Curriculum(data)
  }

  async searchClassOfferings(classCode) {
    if (classCode === null) throw new Error('Class code argument is required.') 

    var page = await this._request(`search_subjects`)
    const dom = new JSDOM(page.response.data)

    const input = {
      classcode: classCode,
      form_id: 'inquiry_form',
      form_token: dom.window.document.querySelector("#inquiry-form > div > input[type=hidden]:nth-child(3)").value, 
      op: 'Search'
    }

    try {
      var x = await axios.post(`${this.#url}/search_subjects`, qs.stringify(input), {
        jar: page.cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    } catch (err) {
      return null
    }

    return new SearchResult(x.data)
  }

  async getPrereg() {
    var preregPage = (await this._request(`preregistration`)).response
    if (preregPage) {
      var data = preregPage.data
    }
    const dom = new JSDOM(data)
    var preregForm = dom.window.document.querySelector("#view-registration-form")

    if (preregForm) {
      return new PreregList(data)
    } else {
      return null // prereg unavailable
    }
  }

  async searchPrereg(classCode) {
    if (classCode === null) throw new Error('Class code argument is required.')

    var page = await this._request(`preregistration`)
    var z = await axios.get(`${this.#url}/preregistration/add/search`, {
      jar: page.cookieJar,
      withCredentials: true
    })

    const dom = new JSDOM(z.data)

    const input = {
      keyword: classCode,
      form_id: 'search_subject_form',
      form_token: dom.window.document.querySelector("#search-subject-form > div > input[type=hidden]:nth-child(3)").value, 
      op: 'Search'
    }

    try {
      var x = await axios.post(`${this.#url}/preregistration/add/search`, qs.stringify(input), {
        jar: page.cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    } catch (err) {
      return null
    }

    return {
      response: new PreregSearchResult(x.data),
      session: {
        page: x.data,
        cookies: page.cookieJar
      }
    }
  }

  async addPrereg(classCode, session) {
    if (classCode === null) throw new Error('Class code argument is required.') 
    if (session === null) throw new Error('Session from searchPrereg required.')
    if (typeof session !== 'object') throw new Error('Invalid session object.')
    if (!('page' in session) || !('cookies' in session)) throw new Error('Invalid session object.')

    var dom = new JSDOM(session.page)
    
    var input = {
      subjects: classCode,
      form_id: 'search_subject_result_form',
      form_token: dom.window.document.querySelector("#search-subject-result-form > div > input[type=hidden]:nth-child(3)").value, 
      op: 'Add Subject'
    }

    try {
      var x = await axios.post(`${this.#url}/preregistration/add/result`, qs.stringify(input), {
        jar: session.cookies,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      dom = new JSDOM(x.data)

      input = {
        form_id: 'search_subject_confirm_form',
        form_token: dom.window.document.querySelector("#search-subject-confirm-form > div > input[type=hidden]:nth-child(3)").value, 
        op: 'Yes'
      }

      var y = await axios.post(`${this.#url}/preregistration/add/confirm`, qs.stringify(input), {
        jar: session.cookies,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      dom = new JSDOM(y.data)

      return dom.window.document.querySelector("#messages-inner > table > tbody > tr:nth-child(2) > td.body > div.content > div").textContent

    } catch (err) {
      return null
    }
  }

  async dropPrereg(id) {
    if (id === null) throw new Error('Preregistration id argument is required.')
    var page = await this._request(`preregistration`)

    var dom = new JSDOM(page.response.data)

    var input = {
      subjects: id,
      form_id: 'view_registration_form',
      form_token: dom.window.document.querySelector("#view-registration-form > div > input[type=hidden]:nth-child(6)").value, 
      op: 'Drop Subject'
    }

    try {
      var x = await axios.post(`${this.#url}/preregistration`, qs.stringify(input), {
        jar: page.cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      dom = new JSDOM(x.data)

      input = {
        form_id: 'drop_subject_confirm_form',
        form_token: dom.window.document.querySelector("#drop-subject-confirm-form > div > input[type=hidden]:nth-child(3)").value, 
        op: 'Yes'
      }

      var y = await axios.post(`${this.#url}/preregistration/drop/confirm`, qs.stringify(input), {
        jar: page.cookieJar,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      dom = new JSDOM(y.data)

      return dom.window.document.querySelector("#messages-inner > table > tbody > tr:nth-child(2) > td.body > div.content > div").textContent

    } catch (err) {
      return null
    }
  }
}

module.exports = SIS