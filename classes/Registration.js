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

  getArray() {
    return this._clean
  }

  get raw() {
    return this._raw
  }
}

module.exports = Registration