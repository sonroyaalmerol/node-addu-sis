const tabletojson = require('tabletojson').Tabletojson

class Grades {
  constructor(html) {
    this._raw = tabletojson.convert(html)[1]
    this._clean = []
    for (var i = 0; i < (this._raw.length - 1); i++) {
      var cleanGrades = {}
      cleanGrades.subjectCode = this._raw[i]['SUBJ NO.']
      cleanGrades.subjectDescription = this._raw[i]['DESCRIPTIVE TITLE']
      cleanGrades.prelimGrade = this._raw[i]['PRELIM']
      cleanGrades.midtermGrade = this._raw[i]['MIDTERM']
      cleanGrades.prefinalGrade = this._raw[i]['PRE-FINAL']
      cleanGrades.finalGrade = this._raw[i]['FINAL']
      cleanGrades.subjectUnits = this._raw[i]['UNITS']

      this._clean.push(cleanGrades)
    }
    this._qpi = this._raw[this._raw.length-1]['FINAL']
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

  get qpi() {
    return this._qpi
  }
}

module.exports = Grades