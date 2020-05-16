const tabletojson = require('html-table-to-json')

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
      var raw = tabletojson.parse(html).results[0]
      this.#card = Object.keys(raw[0])[1]
      this.#id = raw[0][Object.keys(raw[0])[1]]
      this.#name = raw[1][Object.keys(raw[1])[1]]
      this.#course = Object.keys(raw[0])[4]
      this.#section = raw[0][Object.keys(raw[0])[4]]
      this.#division = raw[1][Object.keys(raw[1])[4]]
      this.#year = Object.keys(raw[1])[0]
      this.#status = raw[1][Object.keys(raw[1])[0]]
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