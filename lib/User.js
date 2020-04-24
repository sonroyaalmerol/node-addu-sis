const jsdom = require('jsdom')
const { JSDOM } = jsdom

class User {
  constructor(html) {
    const dom = new JSDOM(html)
  
    this._card = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)").textContent
    this._id = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)").textContent
    this._name = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)").textContent
    this._course = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(4)").textContent
    this._section = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(4)").textContent
    this._division = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(4)").textContent
    this._year = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(6)").textContent
    this._status = dom.window.document.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(6) > strong").textContent
  }

  get card() {
    return this._card
  }
  
  get id() {
    return this._id
  }
  
  get name() {
    return this._name
  }
  
  get course() {
    return this._course
  }
  
  get section() {
    return this._section
  }
  
  get division() {
    return this._division
  }
  
  get year() {
    return parseInt(this._year)
  }
  
  get status() {
    return this._status
  }
}

module.exports = User