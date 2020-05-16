const tabletojson = require('html-table-to-json')

class Balance {

  #balance

  constructor(htmlArray) {
    htmlArray = htmlArray || []
    this.#balance = []
    for (var i = 0; i < htmlArray.length; i++) {
      var newBalance = {}
      var raw = tabletojson.parse(htmlArray[i]).results
      var accountTable = raw[0][1]
      newBalance.academicPeriod = accountTable[Object.keys(accountTable)[4]]
      newBalance.rgcNumber = accountTable[Object.keys(accountTable)[1]]
      newBalance.tuitionFee = parseFloat(raw[1][1]['DUE AMOUNT'].replace(/,/g, ""))
      newBalance.totalWithOldFee = parseFloat(raw[1][1]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
      newBalance.miscLab = parseFloat(raw[1][2]['DUE AMOUNT'].replace(/,/g, ""))
      newBalance.scholarship = parseFloat(raw[1][2]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
      newBalance.totalCurrent = parseFloat(raw[1][3]['DUE AMOUNT'].replace(/,/g, ""))
      newBalance.totalAdjustment = parseFloat(raw[1][3]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
      newBalance.oldAccount = parseFloat(raw[1][4]['DUE AMOUNT'].replace(/,/g, ""))
      newBalance.totalDue = parseFloat(raw[1][4]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
      newBalance.amountPaid = parseFloat(raw[1][5]['PAYMENTS'].replace(/,/g, ""))
      newBalance.balance = parseFloat(raw[1][6]['PAYMENTS'].replace(/,/g, ""))
      newBalance.terms = {
        downpayment: {
          dueAmount: parseFloat(raw[1][7]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[1][7]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[1][7]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        prelims: {
          dueAmount: parseFloat(raw[1][8]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[1][8]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[1][8]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        midterms: {
          dueAmount: parseFloat(raw[1][9]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[1][9]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[1][9]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        finals: {
          dueAmount: parseFloat(raw[1][10]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(raw[1][10]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(raw[1][10]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
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