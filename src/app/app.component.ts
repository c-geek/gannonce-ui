import {Component, ViewChild} from '@angular/core';

import {MenuController, Nav} from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

@Component({
  template: require('./app.html')
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  pages: Array<{title: string, url: string, component: any}>;

  constructor(
    // public platform: Platform
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app2's pages
    this.pages = [
      { title: 'Hello Ionic', url: '/', component: HelloIonicPage },
      { title: 'My First List', url: '/theList', component: ListPage }
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
