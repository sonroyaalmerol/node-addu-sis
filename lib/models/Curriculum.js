const tabletojson = require('tabletojson-rn').Tabletojson

class Curriculum {

  #raw
  #clean

  constructor(html) {
    html = html || ''
    this.#raw = tabletojson.convert(html)[0]
    this.#clean = []
    for (var i = 0; i < this.#raw.length; i++) {
      var cleanSubj = {}
      cleanSubj.yearLevel = this.#raw[i]['YEAR LEVEL']
      cleanSubj.semester = this.#raw[i]['SEMESTER']
      cleanSubj.name = this.#raw[i]['SUBJ. NO']
      cleanSubj.description = this.#raw[i]['DESCRIPTIVE TITLE']
      cleanSubj.grade = this.#raw[i]['GRADE']
      cleanSubj.units = this.#raw[i]['UNITS']
      cleanSubj.remarks = this.#raw[i]['REMARKS']
      cleanSubj.prerequisites = this.#raw[i]['PREREQUISITE']

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

module.exports = Curriculum