import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AlertController} from "ionic-angular";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {KeyPairService} from "./keypair-service";
import {ImageService} from "./image-service";
const co = require('co')
const uuid = require('uuid')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const base58 = require('../lib/base58')

const ANNOUNCE_URL = 'http://l:8600/announce'
const ANNOUNCES_URL = 'http://l:8600/announces'

@Injectable()
export class AnnounceService {

  ann:any

  constructor(
    private http: Http,
    private router: Router,
    private alertCtrl: AlertController,
    public keypairService: KeyPairService,
    public imageService: ImageService
  ) {
    this.ann = {
      pub: '',
      uuid: uuid.v4(),
      title: '',
      desc: '',
      price: '',
      fees: '',
      type: '',
      stock: '',
      images: [
      ]
    }
  }

  get raw() { return this.rawify(this.ann) }

  get key() { return this.keypairService.key }

  beginCreation(pub) {
    this.ann = {
      pub,
      uuid: uuid.v4(),
      title: 'Vente de radis',
      desc: 'Production 2017, bio, par botte.',
      price: '100.00',
      fees: '50.00',
      type: 'Simple',
      stock: '30',
      images: [
      ]
    }
  }

  getAnnounce(uuid:string) {
    return this.http.get(ANNOUNCE_URL + '/' + uuid)
      .toPromise().then((res) => {
        this.ann = res.json().announce
        this.ann.images = this.ann.images || []
      })
  }

  listAllAnnounces() {
    return this.http.get(ANNOUNCES_URL)
      .toPromise()
      .then((res) => {
        return res.json().announces
      })
  }

  myAnnounces(pub) {
    return this.http.get(ANNOUNCES_URL + '/' + pub).toPromise()
      .then((res) => res.json())
      .then(json => {
        for (let i = 0; i < json.announces.length; i++) {
          let ann = json.announces[i];
          ann.desc = ann.desc.replace(/\\n/g, '\n')
        }
        return json
      })
  }

  addImage() {
    this.imageService.getNew()
      .then(img => {
        if (img) {
          this.ann.images.push(img)
        }
      })
  }

  rawify(a) {
    let raw = 'Version: 1\n'
    raw += `Document: Announce\n`
    raw += `Currency: g1\n`
    raw += `Pub: ${a.pub}\n`
    raw += `Uuid: ${a.uuid}\n`
    raw += `Title: ${a.title}\n`
    raw += `Desc: ${a.desc}\n`
    raw += `Price: ${a.price}\n`
    raw += `Fees: ${a.fees}\n`
    raw += `Type: ${a.type}\n`
    raw += `Stock: ${a.stock}\n`
    for (let i = 0; i < a.images.length; i++) {
      raw += `Images[${i}]: ${a.images[i]}\n`
    }
    return raw
  }

  createOrModifyAnnounce(announceForm:NgForm) {
    if (!announceForm.form.valid || !this.key.ok) {
      return
    }
    const that = this
    let raw = this.rawify(this.ann)
    return co(function*() {

      try {

        const pair = yield that.keypairService.getKeyPair()
        const crypto_sign_BYTES = 64;
        const m = tweetnaclUtil.decodeUTF8(raw);
        console.log(base58.encode(pair.publicKey))
        const signedMsg = tweetnacl.sign(m, pair.secretKey)
        const sig = new Uint8Array(crypto_sign_BYTES);
        for (let i = 0; i < sig.length; i++) {
          sig[i] = signedMsg[i];
        }

        that.ann.sig = tweetnaclUtil.encodeBase64(sig)
        raw += `${that.ann.sig || ''}`

        yield that.http.post(ANNOUNCE_URL, { announce: raw }).toPromise()

        announceForm.reset()

        that.router.navigate([`/mes_annonces`])

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
