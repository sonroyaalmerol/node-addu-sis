const tabletojson = require('tabletojson-rn').Tabletojson

class PreregSearchResult {

  #raw
  #clean

  constructor(html) {
    html = html || ''
    this.#raw = tabletojson.convert(html)[0]
    this.#clean = []
    var data = this.#raw
    for (var i = 0; i < data.length; i++) {
      var cleanSubj = {}
      cleanSubj.code = data[i]['CODE']
      cleanSubj.name = data[i]['SUBJECT']
      cleanSubj.description = data[i]['DESCRIPTION']
      cleanSubj.schedule = data[i]['SCHEDULE']
      cleanSubj.division = data[i]['DIVISION']
      cleanSubj.availableSlots = parseInt(data[i]['Available'])
      cleanSubj.totalSlots = parseInt(data[i]['Slots'])
      cleanSubj.reservedSlots = parseInt(data[i]['Pre-registered'])
      cleanSubj.section = parseInt(data[i]['SECTION'])
      cleanSubj.teacher = data[i]['TEACHER']

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

module.exports = PreregSearchResult