import "./vendor";
import {APP_BASE_HREF} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {HttpModule, JsonpModule} from "@angular/http";
import {MyApp} from "./app.component";
import {ImageCropperComponent} from "ng2-img-cropper";

import {LoginService} from "../services/login-service";
import {AccountService} from "../services/account-service";
import {AnnounceService} from "../services/announce-service";

import {HomePage} from "../pages/home/home";
import {ProfilPage} from "../pages/profil/profil";
import {AccountPage} from "../pages/account/account";
import {MyAnnouncesPage} from "../pages/my_announces/my_announces";
import {ItemDetailsPage} from "../pages/item-details/item-details";
import {ListPage} from "../pages/list/list";
import {FormsModule} from "@angular/forms";
import {AnnounceEditPage} from "../pages/announce_new/announce_new";
import {ImageService} from "../services/image-service";
import {ImageModalPage} from "../pages/image-service/modal-page";
import {AnnouncePage} from "../pages/announce/announce";
import {AuthService} from "../services/auth-service";
import {AuthModal} from "../components/auth_modal/auth_modal";

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
    path: 'mon_compte/edit/:pub',
    component: AccountPage
  },
  {
    path: 'mes_annonces',
    component: MyAnnouncesPage
  },
  {
    path: 'announces/new',
    component: AnnounceEditPage,
    data: { creation: true }
  },
  {
    path: 'announce/edit/:uuid',
    component: AnnounceEditPage,
    data: { creation: false }
  },
  {
    path: 'announce/:uuid',
    component: AnnouncePage
  }
];

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilPage,
    AccountPage,
    MyAnnouncesPage,
    AnnounceEditPage,
    AnnouncePage,
    ImageModalPage,
    AuthModal,
    ImageCropperComponent,
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
    MyAnnouncesPage,
    AnnounceEditPage,
    ImageModalPage,
    AuthModal,
    ItemDetailsPage,
    ImageCropperComponent,
    ListPage
  ],
  providers: [
    LoginService,
    AccountService,
    AnnounceService,
    ImageService,
    AuthService,
    {provide: APP_BASE_HREF, useValue: '/#/'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
