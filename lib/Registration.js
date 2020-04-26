const tabletojson = require('tabletojson').Tabletojson

class Registration {

  #raw
  #clean

  constructor(html) {
    html = html || ''
    this.#raw = tabletojson.convert(html)[1]
    this.#clean = []
    for (var i = 0; i < this.#raw.length; i++) {
      var cleanSubj = {}
      cleanSubj.code = this.#raw[i]['CODE']
      cleanSubj.number = this.#raw[i]['SUBJ. NO']
      cleanSubj.description = this.#raw[i]['DESCRIPTIVE TITLE']
      cleanSubj.schedule = this.#raw[i]['SCHEDULE']
      cleanSubj.units = this.#raw[i]['UNIT']

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