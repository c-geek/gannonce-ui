import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {co} from "co";

@Injectable()
export class ItemsResolver implements Resolve<any> {

  resolve(): Promise<any> {
    let icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];
    let items = [];
    for(let i = 1; i < 11; i++) {
      items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: icons[Math.floor(Math.random() * icons.length)]
      });
    }

    // return Promise.resolve(items)
    return co(function*() {
      return yield new Promise((res) => setTimeout(() => {
        res(items)
      }, 1000))
    })
  }
}
