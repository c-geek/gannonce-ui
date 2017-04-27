import { co } from 'co';
import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ToastController} from "ionic-angular";
import {AccountService} from "./account-service";

@Injectable()
export class LoginService {

  pub:string
  estIdentifie:Boolean
  enoughMoney:Boolean

  constructor(
    public accountService: AccountService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

    this.pub = localStorage.getItem('pub')
    this.estIdentifie = !!this.pub
  }

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
          handler: () => {
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
              localStorage.setItem('pub', data.title)
              this.pub = data.title
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
    this.pub = ''
    this.estIdentifie = false
    localStorage.removeItem('pub')
    this.cleIncorrecte("Déconnexion réussie.")
  }

  confirmDisconnection() {
    let confirm = this.alertCtrl.create({
      title: 'Se déconnecter ?',
      message: 'Vous devrez vous reconnecter si vous souhaitez faire d\'autres modifications.',
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui, me déconnecter',
          handler: () => {
            this.disconnect()
          }
        }
      ]
    });
    confirm.present();
  }

  reload() {
    // let loader = this.loadingCtrl.create({
    //   content: "Chargement du compte...",
    //   duration: 3000
    // });
    const that = this

    // loader.present();
    co(function*() {
      const body = yield that.accountService.getAccountInfos(that.pub)
      that.accountService.acc = body.acc
      that.enoughMoney = body.enoughMoney
      console.log(that.enoughMoney)
      // loader.dismissAll();
    })
  }
}
