import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AlertController} from "ionic-angular";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ImageService} from "./image-service";
import {AuthService} from "./auth-service";
const co = require('co')
const uuid = require('uuid')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const base58 = require('../lib/base58')
const conf = require('../lib/conf.js')

const ANNOUNCE_URL = conf.baseUrl + '/announce'
const ANNOUNCES_URL = conf.baseUrl + '/announces'

@Injectable()
export class AnnounceService {

  ann:any
  stockInitial:Number
  creation:Boolean

  constructor(
    private http: Http,
    private router: Router,
    private alertCtrl: AlertController,
    public authService: AuthService,
    public imageService: ImageService
  ) {
    this.clean()
  }

  clean() {
    this.creation = false
    this.stockInitial = 1
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

  beginCreation(pub) {
    this.creation = true
    this.stockInitial = 1
    this.ann = {
      pub,
      uuid: uuid.v4(),
      title: '',
      desc: '',
      descParagraphe: '',
      price: '1',
      fees: '0',
      type: 'Simple',
      stock: '1',
      images: [
      ]
    }
  }

  getAnnounce(uuid:string) {
    return this.http.get(ANNOUNCE_URL + '/' + uuid)
      .toPromise().then((res) => {
        this.ann = res.json().announce
        this.ann.descLigne = this.ann.desc.replace(/\\n+/g, ' ')
        this.ann.descParagraphe = this.ann.desc.replace(/\\n/g, '\n').replace(/\\\n/g, '\\n')
        this.ann.descParagrapheHTML = this.ann.desc
          .replace(/\\n/g, '<br>')
          .replace(/\\<br>/g, '\\n')
        this.ann.feesFloat = parseFloat(this.ann.fees)
        this.ann.images = this.ann.images || []
        this.stockInitial = this.ann.stock
        this.creation = false
      })
  }

  listAllAnnounces(limit, page, search) {
    return this.http.get(ANNOUNCES_URL + '?limit=' + limit + '&page=' + page + '&search=' + encodeURIComponent(search))
      .toPromise()
      .then((res) => {
        return res.json()
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

  resetImages() {
    this.ann.images.pop()
  }

  rawify(a) {
    let raw = 'Version: 1\n'
    raw += `Document: Announce\n`
    raw += `Currency: g1\n`
    raw += `Pub: ${a.pub}\n`
    raw += `Uuid: ${a.uuid}\n`
    raw += `Title: ${a.title}\n`
    raw += `Desc: ${a.descParagraphe.replace(/\\n/g, '\\\\n').replace(/\n/g, '\\n')}\n`
    raw += `Price: ${a.price}\n`
    raw += `Fees: ${a.fees}\n`
    raw += `Type: ${a.type}\n`
    raw += `Stock: ${a.stock}\n`
    for (let i = 0; i < a.images.length; i++) {
      raw += `Images[${i}]: ${a.images[i]}\n`
    }
    return raw
  }

  deleteAnnounce(announceForm:NgForm) {
    this.ann.stock = 0
    this.createOrModifyAnnounce(announceForm)
  }

  createOrModifyAnnounce(announceForm:NgForm) {
    if (!announceForm.form.valid) {
      return
    }
    const that = this
    // Format
    for (const f of ['price', 'fees']) {
      if (!this.ann[f]) {
        this.ann[f] = '0.00'
      }
      if (this.ann[f].match(/^\d+$/)) {
        this.ann[f] = this.ann[f] + '.00'
      }
      if (this.ann[f].match(/^\d+\.$/)) {
        this.ann[f] = this.ann[f] + '00'
      }
      if (this.ann[f].match(/^\d+\.\d$/)) {
        this.ann[f] = this.ann[f] + '0'
      }
    }
    let raw = this.rawify(this.ann)
    return co(function*() {

      try {

        const pair = yield that.authService.getKeyPair(that.ann.pub)
        if (pair) {
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
        }

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
