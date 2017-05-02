import {Component, OnInit} from "@angular/core";
import {AccountService} from "../../services/account-service";
import {LoginService} from "../../services/login-service";
import {ActivatedRoute} from "@angular/router";
import {AnnounceService} from "../../services/announce-service";
import {CrowdfundingService} from "../../services/crowdfunding-service";

@Component({
  selector: 'announce',
  template: require('../../app/topbar.html') + require('./announce.html')
})
export class AnnouncePage implements OnInit {

  titre:string = "Consulter une annonce"

  constructor(
    private route: ActivatedRoute,
    private crowdfundingService: CrowdfundingService,
    public loginService:LoginService,
    public accountService:AccountService,
    public announceService:AnnounceService) {

    if (this.route.snapshot.data.creation) {
      this.announceService.beginCreation(loginService.pub)
    } else {
      this.announceService.clean()
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['uuid']) {
        return this.announceService.getAnnounce(params['uuid'])
          .then(() => {
            this.announceService.ann.pctFunded = this.crowdfundingService.getFundingAmount(this.announceService.ann)
            this.announceService.ann.montants = this.crowdfundingService.getAmountsPaid(this.announceService.ann)
          })
      }
    });
  }
}
