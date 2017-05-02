import { Component } from '@angular/core';
import {AnnounceService} from "../../services/announce-service";
import {CrowdfundingService} from "../../services/crowdfunding-service";

@Component({
  selector: 'home',
  template: require('../../app/topbar.html') + require('./home.html')
})
export class HomePage {

  titre:string = "Toutes les annonces"
  announces:Array<any>

  constructor(private announceService:AnnounceService, private crowdfundingService:CrowdfundingService) {
    this.announces = []
    this.announceService.listAllAnnounces().then(announces => this.announces = announces.map(a => {
      a.thumbnail = a.images[0]
      a.descLigne = a.desc.replace(/\\n/g, ' ')
      a.pctFunded = this.crowdfundingService.getFundingAmount(a)
      return a
    }))
  }
}
