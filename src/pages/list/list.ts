import { Component } from '@angular/core';

import { ItemsResolver } from './list-resolver.service';
// import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [ItemsResolver]
})

export class ListPage {
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(private itemsResolver:ItemsResolver/*public navCtrl: NavController, public navParams: NavParams*/) {

    this.items = [];
    itemsResolver.resolve().then((items) => {
      console.log(items)
      this.items = items;
    })
  }

  itemTapped(event, item) {
    // this.navCtrl.push(ItemDetailsPage, {
    //   item: item
    // });
  }
}
