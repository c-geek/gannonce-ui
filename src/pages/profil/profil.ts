import {Component} from "@angular/core";
import {LoginService} from "../../services/login-service";
import {AccountService} from "../../services/account-service";
import {co} from "co";

@Component({
  selector: 'profil',
  template: require('../../app/topbar.html') + require('./profil.html')
})
export class ProfilPage {

  title:string = "Mon profil"
  enoughMoney:Boolean

  constructor(
    public accountService: AccountService,
    public loginService:LoginService) {

    // let loader = this.loadingCtrl.create({
    //   content: "Chargement du compte...",
    //   duration: 3000
    // });
    const that = this

    // loader.present();
    co(function*() {
      const body = yield that.accountService.getAccountInfos(that.loginService.pub)
      that.accountService.acc = body.acc
      that.enoughMoney = body.enoughMoney
      console.log(that.enoughMoney)
      // loader.dismissAll();
    })
  }
}
