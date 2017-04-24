import { Component } from '@angular/core';
import {LoginService} from "../../services/login-service";

@Component({
  selector: 'profil',
  template: require('../../app/topbar.html') + require('./profil.html')
})
export class ProfilPage {

  title:string = "Mon profil"

  constructor(public loginService:LoginService) {
    console.log(this.loginService.pub)
  }
}
