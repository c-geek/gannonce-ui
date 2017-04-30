import {Component, OnInit} from "@angular/core";
import {LoginService} from "../../services/login-service";
import {ToastController} from "ionic-angular";
import {CryptoService} from "../../services/crypo-service";
import {Router} from "@angular/router";
const seedrandom = require("seedrandom")
const base58 = require('../../lib/base58')

@Component({
  selector: 'connect',
  template: require('../../app/topbar.html') + require('./connect.html')
})
export class ConnectPage implements OnInit {

  title:string = "Se connecter"
  connectionType:string
  pub:string
  salt:string
  passwd:string

  constructor(
    private router: Router,
    public loginService:LoginService,
    public cryptoService: CryptoService,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.connectionType = "file"
    this.pub = ""
    this.salt = ""
    this.passwd = ""
  }

  connect() {
    if (this.connectionType == 'pubkey') {
      if (!this.pub.match(/[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44}/)) {
        this.message("Échec d'identification : '" + this.pub + "' n'est pas une une clé publique valide.")
      } else {
        this.loginService.identify(this.pub)
        this.router.navigate([`/mon_compte`])
      }
    }
    else if (this.connectionType == 'brainwallet') {
      this.cryptoService.getKeyPair(this.salt, this.passwd)
        .then((pair) => {
          this.loginService.identify(base58.encode(pair.publicKey))
          this.router.navigate([`/mon_compte`])
        })
    }
  }

  message(message) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  fileChangeListener($event) {
    this.cryptoService.loadFromFile($event, false)
      .then(pair => {
        this.loginService.identify(base58.encode(pair.publicKey))
        this.router.navigate([`/mon_compte`])
      })
      .catch(err => this.message(err))
  }

  get randomKeyring() {
    const value = sessionStorage.getItem('randomKeyring')
    if (!value) {
      console.log('getRandomKeyring')
      const byteseed = new Uint8Array(32)
      for (let i = 0; i < 32; i++) {
        const random = Math.floor(seedrandom()() *  255) + 1
        byteseed[i] = random
      }
      const keypair = this.cryptoService.keypairFromSeed(byteseed)
      const pub = base58.encode(keypair.publicKey)
      const sec = base58.encode(keypair.secretKey)
      const data = encodeURIComponent('pub: ' + pub + '\nsec: ' + sec)
      sessionStorage.setItem('randomKeyring', "data:application/octet-stream," + data)
    }
    return value || sessionStorage.getItem('randomKeyring')
  }
}
