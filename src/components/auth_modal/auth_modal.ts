import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
const scrypt = require('scrypt-async')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const base58 = require('../../lib/base58')

@Component({
  selector: 'auth_modal',
  template: require('./auth_modal.html')
})
export class AuthModal {

  error:string
  generated:string
  salt:string = ""
  passwd:string = ""
  keyPair:any
  expectedPub:string
  computing:Boolean

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.expectedPub = this.params.get('expectedPub')
  }

  getKeyPair() {
    return new Promise((res) => {
      scrypt(this.passwd, this.salt, {
        N: 4096,
        r: 16,
        p: 1,
        dkLen: 32,
        encoding: 'base64'
      }, function(derivedKey) {
        res(derivedKey);
      });
    })
      .then((seed) => {
        const byteseed = tweetnaclUtil.decodeBase64(seed)
        return tweetnacl.sign.keyPair.fromSeed(byteseed)
      })
  }

  valideCle() {
    this.computing = true
    setTimeout(() => {
      this.getKeyPair()
      .then((pair) => {
        this.computing = false
        this.generated = base58.encode(pair.publicKey)
        this.salt = ""
        this.passwd = ""
        if (this.expectedPub === this.generated) {
          this.viewCtrl.dismiss(pair)
        } else {
          this.error = 'La clé générée n\'est pas celle de votre compte. Une faute de frappe ?'
        }
      })
    }, 100)
  }

  cancel() {
    this.viewCtrl.dismiss(null)
  }
}
