import {Component} from "@angular/core";

import {ItemsResolver} from "./list-resolver.service";
import {App} from "ionic-angular";
import {ItemDetailsPage} from "../item-details/item-details";

@Component({
  selector: 'page-list',
  template: require('./list.html'),
  providers: [ItemsResolver]
})

export class ListPage {

  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public itemsResolver:ItemsResolver, protected app: App) {

    this.items = [];
    itemsResolver.resolve().then((items) => {
      console.log(items)
      this.items = items;
    })
  }

  itemTapped(item) {
    this.app.getRootNav().push(ItemDetailsPage, {
      item: item
    });
  }
}
