import {Component, ViewChild} from '@angular/core';

import {MenuController, Nav} from 'ionic-angular';

import { HelloIonicPage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  template: require('./app.html')
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  site_pages: Array<{title: string, url: string, component: any}>;
  perso_pages: Array<{title: string, url: string, component: any}>;

  constructor(
    // public platform: Platform
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app2's pages
    this.site_pages = [
      { title: 'Toutes les annonces', url: '/', component: HelloIonicPage }
    ];
    this.perso_pages = [
      { title: 'Mon profil',   url: '/mon_compte', component: ListPage },
      { title: 'Mes annonces', url: '/mes_annonces', component: ListPage }
    ];
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    // this.statusBar.styleDefault();
    // this.splashScreen.hide();
    // });
  }
}
