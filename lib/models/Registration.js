const tabletojson = require('html-table-to-json')

class Registration {

  #raw
  #clean

  constructor(html) {
    console.log(html)
    html = html || ''
    this.#raw = tabletojson.parse(html).results
    this.#clean = []
    for (var i = 0; i < this.#raw[1].length; i++) {
      var cleanSubj = {}
      cleanSubj.code = this.#raw[1][i]['CODE']
      cleanSubj.name = this.#raw[1][i]['SUBJ. NO']
      cleanSubj.description = this.#raw[1][i]['DESCRIPTIVE TITLE']
      cleanSubj.schedule = this.#raw[1][i]['SCHEDULE']
      cleanSubj.units = this.#raw[1][i]['UNIT']
      cleanSubj.period = this.#raw[0][2][Object.keys(this.#raw[0][2])[0]]
      this.#clean.push(cleanSubj)
    }
  }

  find(object) {
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this.#clean.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this.#clean[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        return this.#clean[i]
      }
    }
  }

  filter(object) {
    var foundObjects = []
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this.#clean.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this.#clean[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        foundObjects.push(this.#clean[i])
      }
    }
    return foundObjects
  }

  all() {
    return this.#clean
  }
}

module.exports = Registration