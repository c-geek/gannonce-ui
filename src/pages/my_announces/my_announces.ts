import {Component} from "@angular/core";
import {LoginService} from "../../services/login-service";
import {AnnounceService} from "../../services/announce-service";
import {AccountService} from "../../services/account-service";

@Component({
  selector: 'my_announces',
  template: require('../../app/topbar.html') + require('./my_announces.html')
})
export class MyAnnouncesPage {

  announces:any = []
  titre:string = "Mes annonces"

  constructor(
    public loginService:LoginService,
    public accountService:AccountService,
    public announceService:AnnounceService) {

    this.announceService.myAnnounces(loginService.pub)
      .then(res => this.announces = res.announces.map(a => {
        a.thumbnail = a.images[0]
        return a
      }))
  }
}
