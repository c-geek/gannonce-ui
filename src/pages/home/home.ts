import { Component } from '@angular/core';
import {AnnounceService} from "../../services/announce-service";

@Component({
  selector: 'home',
  template: require('../../app/topbar.html') + require('./home.html')
})
export class HomePage {

  title:string = "Toutes les annonces"
  announces:Array<any>

  constructor(private announceService:AnnounceService) {
    this.announces = []
    this.announceService.listAllAnnounces().then(announces => this.announces = announces.map(a => {
      a.thumbnail = a.images[0]
      return a
    }))
  }
}
