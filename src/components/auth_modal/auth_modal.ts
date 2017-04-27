import {Component, OnInit, ViewChild} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
const scrypt = require('scrypt-async')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const base58 = require('../../lib/base58')

@Component({
  selector: 'auth_modal',
  template: require('./auth_modal.html')
})
export class AuthModal implements OnInit {

  @ViewChild('saltinput') saltInput;

  error:string
  generated:string
  salt:string
  passwd:string
  expectedPub:string
  computing:Boolean
  remember:Boolean
  noConfirm:Boolean

  constructor(
    private params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.expectedPub = this.params.get('expectedPub')
    this.salt = sessionStorage.getItem('salt')
    this.passwd = sessionStorage.getItem('passwd')
    this.remember = Boolean(sessionStorage.getItem('remember'))
    this.noConfirm = Boolean(sessionStorage.getItem('noConfirm'))
  }

  ngOnInit(): void {
    if (this.noConfirm) {
      this.valideCle()
    }

    if (!this.remember) {
      setTimeout(() => {
        this.saltInput.setFocus();
      },150);
    }
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
        const salt = this.salt, passwd = this.passwd
        this.salt = ""
        this.passwd = ""
        if (this.expectedPub === this.generated) {
          // Success auth
          if (this.remember) {
            sessionStorage.setItem('salt', salt)
            sessionStorage.setItem('passwd', passwd)
            sessionStorage.setItem('remember', "1")
          } else {
            sessionStorage.removeItem('salt')
            sessionStorage.removeItem('passwd')
            sessionStorage.removeItem('remember')
            sessionStorage.removeItem('remember')
          }
          if (this.noConfirm) {
            sessionStorage.setItem('noConfirm', "1")
          } else {
            sessionStorage.removeItem('noConfirm')
          }
          this.viewCtrl.dismiss(pair)
        } else {
          this.error = 'La clé générée n\'est pas celle de votre compte. Une faute de frappe ?'
        }
      })
    }, 500)
  }

  cancel() {
    this.viewCtrl.dismiss(null)
  }
}
