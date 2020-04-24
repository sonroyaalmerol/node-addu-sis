const tabletojson = require('tabletojson').Tabletojson

class Registration {
  constructor(html) {
    this._raw = tabletojson.convert(html)[1]
    this._clean = []
    for (var i = 0; i < this._raw.length; i++) {
      var cleanSubj = {}
      cleanSubj.code = this._raw[i]['CODE']
      cleanSubj.number = this._raw[i]['SUBJ. NO']
      cleanSubj.description = this._raw[i]['DESCRIPTIVE TITLE']
      cleanSubj.schedule = this._raw[i]['SCHEDULE']
      cleanSubj.units = this._raw[i]['UNIT']

      this._clean.push(cleanSubj)
    }
  }

  find(object) {
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this._clean.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this._clean[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        return this._clean[i]
      }
    }
  }

  filter(object) {
    var foundObjects = []
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this._clean.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this._clean[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        foundObjects.push(this._clean[i])
      }
    }
    return foundObjects
  }

  all() {
    return this._clean
  }

  get raw() {
    return this._raw
  }
}

module.exports = Registration