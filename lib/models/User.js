const { jsdom } = require('jsdom-jscore-rn')

class User {

  #card
  #id
  #name
  #course
  #section
  #division
  #year
  #status

  constructor(html) {
    html = html || ''
    if (html) {
      const dom = new jsdom(html)
    
      this.#card = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2)").textContent
      this.#id = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)").textContent
      this.#name = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(2)").textContent
      this.#course = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(4)").textContent
      this.#section = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(4)").textContent
      this.#division = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(4)").textContent
      this.#year = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(6)").textContent
      this.#status = dom.querySelector("#view-registration-form > div > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(6) > strong").textContent
    }
  }

  all() {
    return {
      card: this.#card,
      id: this.#id,
      name: this.#name,
      course: this.#course,
      section: this.#section,
      division: this.#division,
      year: this.#year,
      status: this.#status
    }
  }

  get card() {
    return this.#card
  }
  
  get id() {
    return this.#id
  }
  
  get name() {
    return this.#name
  }
  
  get course() {
    return this.#course
  }
  
  get section() {
    return this.#section
  }
  
  get division() {
    return this.#division
  }
  
  get year() {
    return parseInt(this.#year)
  }
  
  get status() {
    return this.#status
  }
}

module.exports = User