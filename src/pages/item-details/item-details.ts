import { Component } from '@angular/core';
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-item-details',
  template: `abc`
})

export class ItemDetailsPage {
  selectedItem: any;

  constructor(/*public navCtrl: NavController*/public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param

    this.selectedItem = navParams.get('item');
  }
}
