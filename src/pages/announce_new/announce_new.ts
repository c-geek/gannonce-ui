import {Component, OnInit} from "@angular/core";
import {AccountService} from "../../services/account-service";
import {LoginService} from "../../services/login-service";
import {ActivatedRoute} from "@angular/router";
import {AnnounceService} from "../../services/announce-service";

@Component({
  selector: 'announce_new',
  template: require('../../app/topbar.html') + require('./announce_new.html')
})
export class AnnounceEditPage implements OnInit {

  title:string = "Éditer une annonce"

  constructor(
    private route: ActivatedRoute,
    public loginService:LoginService,
    public accountService:AccountService,
    public announceService:AnnounceService) {

    if (this.route.snapshot.data.creation) {
      this.announceService.beginCreation(loginService.pub)
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['uuid']) {
        return this.announceService.getAnnounce(params['uuid'])
      }
    });
  }

  get raw() {
    return this.announceService.rawify(this.announceService.ann)
  }
}
