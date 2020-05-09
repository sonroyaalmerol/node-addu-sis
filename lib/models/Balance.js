const tabletojson = require('tabletojson').Tabletojson

class Balance {

  #balance

  constructor(htmlArray) {
    htmlArray = htmlArray || []
    this.#balance = []
    for (var i = 0; i < htmlArray.length; i++) {
      var newBalance = {}
      var raw = tabletojson.convert(htmlArray[i])
      newBalance.academicPeriod = raw[0][2]['3']
      newBalance.rgcNumber = raw[0][2]['1']
      newBalance.tuitionFee = parseFloat(raw[2][0]['1'].replace(/,/g, ""))
      newBalance.totalWithOldFee = parseFloat(raw[2][0]['3'].replace(/,/g, ""))
      newBalance.miscLab = parseFloat(raw[2][1]['1'].replace(/,/g, ""))
      newBalance.scholarship = parseFloat(raw[2][1]['3'].replace(/,/g, ""))
      newBalance.totalCurrent = parseFloat(raw[2][2]['1'].replace(/,/g, ""))
      newBalance.totalAdjustment = parseFloat(raw[2][2]['3'].replace(/,/g, ""))
      newBalance.oldAccount = parseFloat(raw[2][3]['1'].replace(/,/g, ""))
      newBalance.totalDue = parseFloat(raw[2][3]['3'].replace(/,/g, ""))
      newBalance.amountPaid = parseFloat(raw[2][4]['2'].replace(/,/g, ""))
      newBalance.balance = parseFloat(raw[2][5]['2'].replace(/,/g, ""))
      newBalance.terms = {
        downpayment: {
          dueAmount: parseFloat(raw[3][0]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[3][0]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[3][0]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        prelims: {
          dueAmount: parseFloat(raw[3][1]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[3][1]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[3][1]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        midterms: {
          dueAmount: parseFloat(raw[3][2]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[3][2]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[3][2]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        finals: {
          dueAmount: parseFloat(raw[3][3]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[3][3]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[3][3]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        }
      }
      this.#balance.push(newBalance)
    }
  }

  find(object) {
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this.#balance.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this.#balance[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        return this.#balance[i]
      }
    }
  }

  filter(object) {
    var foundObjects = []
    var keysToFind = Object.keys(object)
    for (var i = 0; i < this.#balance.length; i++) {
      var found = false
      for (var j = 0; j < keysToFind.length; j++) {
        if (this.#balance[i][keysToFind[j]] !== object[keysToFind]) {
          found = false
          break
        }
        found = true
      }
      if (found) {
        foundObjects.push(this.#balance[i])
      }
    }
    return foundObjects
  }

  all() {
    return this.#balance
  }
}

module.exports = Balance