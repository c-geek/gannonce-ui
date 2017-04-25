import './vendor';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {HttpModule, JsonpModule} from "@angular/http";
import { MyApp } from './app.component';

import { LoginService } from '../services/login-service';
import { AccountService } from '../services/account-service';

import { HomePage } from '../pages/home/home';
import { ProfilPage } from '../pages/profil/profil';
import { AccountPage } from '../pages/account/account';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import {FormsModule} from "@angular/forms";

const appRoutes: Routes = [
  {
    path: '',
    component: HomePage,
    data: { title: 'Titre 1' }
  },
  {
    path: 'mon_compte',
    component: ProfilPage,
    data: { title: 'Titre 2' }
  },
  {
    path: 'mon_compte/creer',
    component: AccountPage,
    data: { creation: true }
  },
  {
    path: 'mon_compte/modifier',
    component: AccountPage
  }
];

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilPage,
    AccountPage,
    ItemDetailsPage,
    ListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilPage,
    AccountPage,
    ItemDetailsPage,
    ListPage
  ],
  providers: [
    LoginService,
    AccountService,
    {provide: APP_BASE_HREF, useValue: '/#/'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
