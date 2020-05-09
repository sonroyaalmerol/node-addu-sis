const tabletojson = require('tabletojson').Tabletojson

class Grades {

  #grades
  constructor(htmlArray) {
    htmlArray = htmlArray || []
    this.#grades = []
    for (var x = 0; x < htmlArray.length; x++) {
      var newGrades = {
        subjects: [],
        qpi: ''
      }
      var raw = tabletojson.convert(htmlArray[x])
      newGrades.academicPeriod = raw[0][2]['3']
      newGrades.qpi = raw[1][raw[1].length-1]['FINAL']
      for (var i = 0; i < (raw.length - 1); i++) {
        var cleanGrades = {}
        var regExp = /\(([^)]+)\)/
        cleanGrades.code = regExp.exec(raw[1][i]['SUBJ NO.'])[1]
        cleanGrades.name = raw[1][i]['SUBJ NO.'].replace(/ *\([^)]*\) */g, "")
        cleanGrades.description = raw[1][i]['DESCRIPTIVE TITLE'].replace(/ *\([^)]*\) */g, "")
        cleanGrades.schedule = regExp.exec(raw[1][i]['DESCRIPTIVE TITLE'])[1]
        cleanGrades.prelimGrade = raw[1][i]['PRELIM']
        cleanGrades.midtermGrade = raw[1][i]['MIDTERM']
        cleanGrades.prefinalGrade = raw[1][i]['PRE-FINAL']
        cleanGrades.finalGrade = raw[1][i]['FINAL']
        cleanGrades.units = raw[1][i]['UNITS']

        newGrades.subjects.push(cleanGrades)
      }
      this.#grades.push(newGrades)
    }
  }

  find(object) {
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this.#grades.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this.#grades[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        return this.#grades[i]
      }
    }
  }

  filter(object) {
    var foundObjects = []
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this.#grades.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this.#grades[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        foundObjects.push(this.#grades[i])
      }
    }
    return foundObjects
  }

  all() {
    return this.#grades
  }
}

module.exports = Grades