import {Injectable} from "@angular/core";

@Injectable()
export class CrowdfundingService {

  constructor() {
  }

  getFundingAmount(a) {
    // Calcul du montant financé
    const montants = this.getAmountsPaid(a)
    let montant = 0
    for (const mt of montants) {
      montant += mt.amount
    }
    const prixSansVirgule = parseFloat(a.price) * 100
    const pctFunded = (montant / prixSansVirgule) * 100
    return parseInt(String(pctFunded))
  }

  getAmountsPaid(a) {
    const montants = []
    for (const tx of (a.payments || [])) {
      for(const output of tx.outputs) {
        if (output.match(new RegExp(":SIG\\(" + a.pub + "\\)"))) {
          const sp = output.split(':')
          const amount = parseInt(sp[0])
          const base = parseInt(sp[1])
          montants.push({
            amount: amount * Math.pow(10, base),
            issuer: tx.issuers[0]
          })
        }
      }
    }
    return montants
  }
}
