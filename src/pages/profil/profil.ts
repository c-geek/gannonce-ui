import {Component} from "@angular/core";
import {LoginService} from "../../services/login-service";
import {AccountService} from "../../services/account-service";

@Component({
  selector: 'profil',
  template: require('../../app/topbar.html') + require('./profil.html')
})
export class ProfilPage {

  title:string = "Mon profil"

  constructor(
    public accountService: AccountService,
    public loginService:LoginService) {

    loginService.reload()
  }
}
