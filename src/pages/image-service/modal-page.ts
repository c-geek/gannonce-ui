import {Component, ViewChild} from "@angular/core";
import { CropperSettings, ImageCropperComponent } from "ng2-img-cropper";
import {ViewController} from "ionic-angular";

@Component({
  selector: 'image_modal',
  template: require('./modal-page.html')
})
export class ImageModalPage {
  data: any;
  cropperSettings: CropperSettings;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;

  constructor(public viewCtrl: ViewController) {
    this.cropperSettings = new CropperSettings()
    this.cropperSettings.noFileInput = true
    this.cropperSettings.fileType = 'image/png'
    this.cropperSettings.croppedHeight = 250
    this.cropperSettings.croppedWidth = 250
    this.cropperSettings.preserveSize = false
    this.data = {};
  }

  fileChangeListener($event) {
    const image:any = new Image();
    const file:File = $event.target.files[0];
    const myReader:FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }

  cancel() {
    this.viewCtrl.dismiss(null)
  }

  saveImage() {
    this.viewCtrl.dismiss(this.data.image)
  }
}
