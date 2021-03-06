import {Component, OnInit} from "@angular/core";
import {AccountService} from "../../services/account-service";
import {ActivatedRoute} from "@angular/router";
import {LoginService} from "../../services/login-service";

@Component({
  selector: 'account_edit',
  template: require('../../app/topbar.html') + require('./account_edit.html')
})
export class AccountEditPage implements OnInit {

  titre:string

  constructor(
    private route: ActivatedRoute,
    public loginService:LoginService,
    public accountService:AccountService) {

    if (this.route.snapshot.data.creation) {
      accountService.beginCreation(loginService.pub)
    }
  }

  ngOnInit() {
    this.titre = "Créer mon compte"
    this.route.params.subscribe(params => {
      if (params['pub']) {
        return this.accountService.getAccountInfos(params['pub'])
          .then(res => {
            this.accountService.acc = res.acc
            this.titre = "Modifier mon compte"
          })
      }
    });
  }
}
