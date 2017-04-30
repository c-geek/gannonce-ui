import {Component, OnInit, ViewChild} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {CryptoService} from "../../services/crypo-service";
import {LoginService} from "../../services/login-service";
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
  connectionType:string
  computing:Boolean
  remember:Boolean
  noConfirm:Boolean
  pair:any

  constructor(
    private params: NavParams,
    public loginService: LoginService,
    public cryptoService: CryptoService,
    public viewCtrl: ViewController
  ) {
    this.expectedPub = this.params.get('expectedPub')
    this.salt = sessionStorage.getItem('salt')
    this.passwd = sessionStorage.getItem('passwd')
    this.remember = Boolean(sessionStorage.getItem('remember'))
    this.noConfirm = Boolean(sessionStorage.getItem('noConfirm'))
    this.connectionType = sessionStorage.getItem('connectionType')
    this.pair = this.loadMemorizedPair()
  }

  loadMemorizedPair() {
    if (sessionStorage.getItem('publicKey')) {
      return {
        publicKey: base58.decode(sessionStorage.getItem('publicKey')),
        secretKey: base58.decode(sessionStorage.getItem('secretKey'))
      }
    }
    return null
  }

  ngOnInit(): void {
    // Memorisation par salt/passwd
    if (this.noConfirm && this.salt) {
      this.valideCle()
    }

    // Memorisation par fichier
    if (this.remember && this.pair) {
      this.connectionType = 'file'
      this.viewCtrl.dismiss(this.pair)
    }

    if (!this.remember && this.connectionType == 'brainwallet') {
      setTimeout(() => {
        this.saltInput.setFocus();
      },150);
    }
  }

  fileChangeListener($event) {
    this.cryptoService.loadFromFile($event, true)
      .then(pair => {
        if (this.remember) {
          sessionStorage.setItem('publicKey', base58.encode(pair.publicKey))
          sessionStorage.setItem('secretKey', base58.encode(pair.secretKey))
          sessionStorage.setItem('remember', "1")
        }
        sessionStorage.setItem('connectionType', 'file')
        this.viewCtrl.dismiss(pair)
      })
      .catch(err => this.error = err)
  }

  getKeyPair() {
    return this.cryptoService.getKeyPair(this.salt, this.passwd)
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
            sessionStorage.removeItem('noConfirm')
            sessionStorage.removeItem('randomKeyring')
          }
          if (this.noConfirm) {
            sessionStorage.setItem('noConfirm', "1")
          } else {
            sessionStorage.removeItem('noConfirm')
          }
          sessionStorage.setItem('connectionType', 'brainwallet')
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
