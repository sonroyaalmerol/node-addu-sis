const tabletojson = require('tabletojson-rn').Tabletojson

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
      var raw = tabletojson.convert(html)[0]
      this.#card = raw[0]['1']
      this.#id = raw[1]['1']
      this.#name = raw[2]['1']
      this.#course = raw[0]['3']
      this.#section = raw[1]['3']
      this.#division = raw[2]['3']
      this.#year = raw[0]['5']
      this.#status = raw[2]['5']
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