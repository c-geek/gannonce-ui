import {Injectable} from "@angular/core";
import {ModalController} from "ionic-angular";
import { ImageModalPage } from '../pages/image-service/modal-page';


@Injectable()
export class ImageService {

  constructor(public modalCtrl: ModalController) {
  }

  getNew() {
    let modal = this.modalCtrl.create(ImageModalPage);
    modal.present();
    return new Promise((res) => {
      modal.onDidDismiss(data => {
        res(data)
      });
    })
  }
}
