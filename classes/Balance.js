const tabletojson = require('tabletojson').Tabletojson

class Balance {
  constructor(html) {
    var raw = tabletojson.convert(html)
    this._academicPeriod = raw[0][2]['3']
    this._rgcNumber = raw[0][2]['1']
    this._tuitionFee = parseFloat(raw[2][0]['1'].replace(/,/g, ""))
    this._totalWithOldFee = parseFloat(raw[2][0]['3'].replace(/,/g, ""))
    this._miscLab = parseFloat(raw[2][1]['1'].replace(/,/g, ""))
    this._scholarship = parseFloat(raw[2][1]['3'].replace(/,/g, ""))
    this._totalCurrent = parseFloat(raw[2][2]['1'].replace(/,/g, ""))
    this._totalAdjustment = parseFloat(raw[2][2]['3'].replace(/,/g, ""))
    this._oldAccount = parseFloat(raw[2][3]['1'].replace(/,/g, ""))
    this._totalDue = parseFloat(raw[2][3]['3'].replace(/,/g, ""))
    this._amountPaid = parseFloat(raw[2][4]['2'].replace(/,/g, ""))
    this._balance = parseFloat(raw[2][5]['2'].replace(/,/g, ""))
    this._terms = {
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
  }

  get academicPeriod() {
    return this._academicPeriod
  }

  get rgcNumber() {
    return this._rgcNumber
  }

  get tuitionFee() {
    return this._tuitionFee
  }

  get totalWithOldFee() {
    return this._totalWithOldFee
  }

  get miscLab() {
    return this._miscLab
  }

  get scholarship() {
    return this._scholarship
  }

  get totalCurrent() {
    return this._totalCurrent
  }

  get totalAdjustment() {
    return this._totalAdjustment
  }

  get oldAccount() {
    return this._oldAccount
  }

  get totalDue() {
    return this._totalDue
  }

  get amountPaid() {
    return this._amountPaid
  }

  get balance() {
    return this._balance
  }

  get terms() {
    return this._terms
  }
}

module.exports = Balance