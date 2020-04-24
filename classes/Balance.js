const tabletojson = require('tabletojson').Tabletojson

class Balance {
  constructor(html) {
    this._raw = tabletojson.convert(html)
    this._clean = {
      academicPeriod: this._raw[0][2]['3'],
      rgcNumber: this._raw[0][2]['1'],
      tuitionFee: parseFloat(this._raw[2][0]['1'].replace(/,/g, "")),
      totalWithOldFee: parseFloat(this._raw[2][0]['3'].replace(/,/g, "")),
      miscLab: parseFloat(this._raw[2][1]['1'].replace(/,/g, "")),
      scholarship: parseFloat(this._raw[2][1]['3'].replace(/,/g, "")),
      totalCurrent: parseFloat(this._raw[2][2]['1'].replace(/,/g, "")),
      totalAdjustment: parseFloat(this._raw[2][2]['3'].replace(/,/g, "")),
      oldAccount: parseFloat(this._raw[2][3]['1'].replace(/,/g, "")),
      totalDue: parseFloat(this._raw[2][3]['3'].replace(/,/g, "")),
      amountPaid: parseFloat(this._raw[2][4]['2'].replace(/,/g, "")),
      balance: parseFloat(this._raw[2][5]['2'].replace(/,/g, "")),
      terms: {
        downpayment: {
          dueAmount: parseFloat(this._raw[3][0]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(this._raw[3][0]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(this._raw[3][0]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        prelims: {
          dueAmount: parseFloat(this._raw[3][1]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(this._raw[3][1]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(this._raw[3][1]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        midterms: {
          dueAmount: parseFloat(this._raw[3][2]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(this._raw[3][2]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(this._raw[3][2]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        },
        finals: {
          dueAmount: parseFloat(this._raw[3][3]['DUE AMOUNT'].replace(/,/g, "")),
          payments: parseFloat(this._raw[3][3]['PAYMENTS'].replace(/,/g, "")),
          balance: parseFloat(this._raw[3][3]['BALANCE  (OVERPAYMENT)'].replace(/,/g, ""))
        }
      }
    }
  }

  get clean() {
    return this._clean
  }

  get raw() {
    return this._raw
  }
}

module.exports = Balance