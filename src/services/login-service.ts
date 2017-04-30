import {Injectable} from "@angular/core";
import {AlertController, ToastController} from "ionic-angular";

@Injectable()
export class LoginService {

  pub:string
  estIdentifie:Boolean

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

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
              this.identify(data.title)
            }
          }
        }
      ]
    });
    prompt.present();
  }

  identify(pub:string) {
    localStorage.setItem('pub', pub)
    this.pub = pub
    this.estIdentifie = true
    this.cleIncorrecte("Identification réussie.")
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
    sessionStorage.removeItem('salt')
    sessionStorage.removeItem('passwd')
    sessionStorage.removeItem('remember')
    sessionStorage.removeItem('publicKey')
    sessionStorage.removeItem('secretKey')
    sessionStorage.removeItem('connectionType')
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
}
