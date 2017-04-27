import {Injectable} from "@angular/core";
import {ModalController} from "ionic-angular";
import {AuthModal} from "../components/auth_modal/auth_modal";

@Injectable()
export class AuthService {

  constructor(
    public modalCtrl: ModalController
  ) {
  }

  getKeyPair(expectedPub) {
    let modal = this.modalCtrl.create(AuthModal, { expectedPub });
    modal.present();
    return new Promise((resolve) => {
      modal.onDidDismiss(data => {
        if (!data) {
          resolve()
        } else {
          resolve(data)
        }
      });
    })
  }
}
