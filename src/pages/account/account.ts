import {Component, OnInit} from "@angular/core";
import {AccountService} from "../../services/account-service";
import {LoginService} from "../../services/login-service";
import {ActivatedRoute} from "@angular/router";
import {AnnounceService} from "../../services/announce-service";

@Component({
  selector: 'account',
  template: require('../../app/topbar.html') + require('./account.html')
})
export class AccountPage implements OnInit {

  titre:string = "Consulter un vendeur"
  announces:any

  constructor(
    private route: ActivatedRoute,
    public loginService:LoginService,
    public accountService:AccountService,
    public announceService:AnnounceService) {

    if (this.route.snapshot.data.creation) {
      this.accountService.beginCreation(loginService.pub)
    } else {
      this.accountService.clean()
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['pub']) {
        return this.accountService.getAccountInfos(params['pub'])
          .then(res => this.accountService.acc = res.acc)
          .then(() => {
            return this.announceService.myAnnounces(this.accountService.acc.pub)
          })
          .then(res => {
            this.announces = []
            for (const a of res.announces) {
              if (parseInt(a.stock)) {
                if (a.images.length) {
                  a.thumbnail = a.images[0]
                }
                this.announces.push(a)
              }
            }
          })
      }
    });
  }
}
