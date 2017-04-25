import {Component} from "@angular/core";
import {AccountService} from "../../services/account-service";
import {ActivatedRoute} from "@angular/router";
import {LoginService} from "../../services/login-service";

@Component({
  selector: 'account',
  template: require('../../app/topbar.html') + require('./account.html')
})
export class AccountPage {

  title:string = "Créer ou modifier mon compte"

  constructor(
    private route: ActivatedRoute,
    public loginService:LoginService,
    public accountService:AccountService) {

    if (this.route.snapshot.data.creation) {
      accountService.beginCreation(loginService.pub)
    }
  }
}
