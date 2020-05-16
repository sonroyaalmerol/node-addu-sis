const tabletojson = require('html-table-to-json')

class PreregList {

  #raw
  #clean

  constructor(html) {
    html = html || ''
    this.#raw = tabletojson.parse(html, { htmlCells: true }).results[1]
    this.#clean = []
    var data = this.#raw
    console.log(data)
    for (var i = 0; i < data.length; i++) {
      var cleanSubj = {}
      var test = data[i]['1']
      cleanSubj.id = test.match(new RegExp('id="edit-subjects-' + "(.*)" + '" name="subjects"'))[1]
      cleanSubj.code = data[i]['CODE']
      cleanSubj.name = data[i]['SUBJ. NO']
      cleanSubj.description = data[i]['DESCRIPTIVE TITLE']
      cleanSubj.schedule = data[i]['SCHEDULE']
      cleanSubj.units = data[i]['TRANSCRIPT LOAD']

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

module.exports = PreregList