const tabletojson = require('tabletojson').Tabletojson

class Curriculum {
  constructor(html) {
    this._raw = tabletojson.convert(html)[0]
    this._clean = []
    for (var i = 0; i < this._raw.length; i++) {
      var cleanSubj = {}
      cleanSubj.yearLevel = this._raw[i]['YEAR LEVEL']
      cleanSubj.semester = this._raw[i]['SEMESTER']
      cleanSubj.subjectNumber = this._raw[i]['SUBJ. NO']
      cleanSubj.description = this._raw[i]['DESCRIPTIVE TITLE']
      cleanSubj.grade = this._raw[i]['GRADE']
      cleanSubj.units = this._raw[i]['UNITS']
      cleanSubj.remarks = this._raw[i]['REMARKS']
      cleanSubj.prerequisites = this._raw[i]['PREREQUISITE']

      this._clean.push(cleanSubj)
    }
  }

  getArray() {
    return this._clean
  }

  get raw() {
    return this._raw
  }
}

module.exports = Curriculum