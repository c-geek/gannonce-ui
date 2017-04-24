import {Component, ViewChild} from '@angular/core';

import {AlertController, MenuController, Nav, ToastController} from 'ionic-angular';

import { HelloIonicPage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  template: require('./app.html')
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  pub:string;
  estIdentifie:Boolean;
  site_pages: Array<{title: string, url: string, component: any}>;
  perso_pages: Array<{title: string, url: string, component: any}>;

  constructor(
    // public platform: Platform
    public menu: MenuController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    this.initializeApp();

    this.pub = localStorage.getItem('pub')
    this.estIdentifie = !!this.pub

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
  },

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Identification',
      message: "Collez ci-dessous une clé publique de porte-monnaie Ğ1.",
      inputs: [
        {
          name: 'title',
          placeholder: 'Clé publique "a4ce87z..."'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            this.cleIncorrecte("Aucune clé saisie. Opération annulée.")
          }
        },
        {
          text: 'Valider',
          handler: data => {
            if (!data.title) {
              this.cleIncorrecte("Aucune clé saisie. Opération annulée.")
            }
            else if (!data.title.match(/[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44}/)) {
              this.cleIncorrecte("Échec d'identification : '" + data.title + "' n'est pas une une clé publique valide.")
            } else {
              localStorage.setItem('pub', data)
              this.estIdentifie = true
              this.cleIncorrecte("Identification réussie.")
            }
          }
        }
      ]
    });
    prompt.present();
  }

  cleIncorrecte(message) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  disconnect() {
    this.estIdentifie = false
    this.cleIncorrecte("Déconnexion réussie.")
  }
}
