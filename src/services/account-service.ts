import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AlertController} from "ionic-angular";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
const co = require('co')
const uuid = require('uuid')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const scrypt = require('scrypt-async')
const base58 = require('../lib/base58')

const ACCOUNT_URL = 'http://l:8600/account'

@Injectable()
export class AccountService {

  link:string
  acc:any
  key:any
  timeoutComputeKey:any
  computingKey:Boolean

  constructor(
    private http: Http,
    private router: Router,
    private alertCtrl: AlertController) {
    this.key = {
      salt: '',
      passwd: '',
      ok: false
    }
  }

  get raw() { return this.rawify(this.acc) }

  ajouterLien(lien:string) {
    this.acc.links.push(lien)
    this.link = ''
  }

  retirerLien(lien:string) {
    const index = this.acc.links.indexOf(lien)
    if (index !== -1) {
      this.link = this.acc.links.splice(index, 1)[0]
    }
  }

  beginCreation(pub) {
    this.acc = {
      pub,
      uuid: uuid.v4(),
      title: '',
      desc: '',
      address: '',
      logo: '',
      links: [
      ]
    }
  }

  getAccountInfos(pub:string) {
    return this.http.get(ACCOUNT_URL + '/' + pub).toPromise()
      .then((res) => res.json())
      .then(json => {
        json.acc.desc = json.acc.desc.replace(/\\n/g, '\n')
        return json
      })
  }

  rawify(acc) {
    let raw = 'Version: 1\n'
    raw += `Document: Account\n`
    raw += `Currency: g1\n`
    raw += `Pub: ${acc.pub}\n`
    raw += `Uuid: ${acc.uuid}\n`
    raw += `Title: ${acc.title}\n`
    raw += `Desc: ${acc.desc.replace(/\n/g, '\\n')}\n`
    raw += `Address: ${acc.address}\n`
    raw += `Logo: ${acc.logo}\n`
    for (let i = 0; i < acc.links.length; i++) {
      raw += `Links[${i}]: ${acc.links[i]}\n`
    }
    return raw
  }

  verifieCle() {
    this.computingKey = true
    if (this.timeoutComputeKey) {
      clearTimeout(this.timeoutComputeKey)
    }
    console.log('Verif clé')
    this.timeoutComputeKey = setTimeout(() => {
      this.getKeyPair()
        .then((pair) => {
          const pub = base58.encode(pair.publicKey)
          console.log(pub)
          console.log(this.acc.pub)
          if (this.acc.pub === pub) {
            this.key.ok = true
          }
        })
        .then(() => this.computingKey = false)
        .catch(() => this.computingKey = false)
    }, 1000)
  }

  getKeyPair() {
    const that = this
    return co(function*() {
      const seed = yield new Promise((res) => {
        scrypt(that.key.passwd, that.key.salt, {
          N: 4096,
          r: 16,
          p: 1,
          dkLen: 32,
          encoding: 'base64'
        }, function(derivedKey) {
          res(derivedKey);
        });
      })

      const byteseed = tweetnaclUtil.decodeBase64(seed)
      return tweetnacl.sign.keyPair.fromSeed(byteseed)
    })
  }

  createOrModifyAccount(accountForm:NgForm) {
    if (!accountForm.form.valid) {
      return
    }
    const that = this
    let raw = this.rawify(this.acc)
    return co(function*() {

      try {

        const pair = yield that.getKeyPair()
        const crypto_sign_BYTES = 64;
        const m = tweetnaclUtil.decodeUTF8(raw);
        console.log(base58.encode(pair.publicKey))
        const signedMsg = tweetnacl.sign(m, pair.secretKey)
        const sig = new Uint8Array(crypto_sign_BYTES);
        for (let i = 0; i < sig.length; i++) {
          sig[i] = signedMsg[i];
        }

        that.acc.sig = tweetnaclUtil.encodeBase64(sig)
        raw += `${that.acc.sig || ''}`

        yield that.http.post(ACCOUNT_URL, { account: raw }).toPromise()

        accountForm.reset()

        that.router.navigate([`/mon_compte`])

      } catch (e) {
        if (e._body) {
          e = JSON.parse(e._body)
        }
        let alert = that.alertCtrl.create({
          title: 'Error',
          subTitle: "Le compte n'a pas pu être créé ou modifié.\n\n\nErreur technique : " + (e.message || (e.error && (e.error.message || e.error)) || 'Erreur inconnue'),
          buttons: ['OK']
        });
        alert.present();
      }

    })
  }
}
