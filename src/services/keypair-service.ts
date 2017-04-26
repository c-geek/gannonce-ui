import {Injectable} from "@angular/core";
const co = require('co')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const scrypt = require('scrypt-async')
const base58 = require('../lib/base58')


@Injectable()
export class KeyPairService {

  key:any = {}
  timeoutComputeKey:any
  computingKey:Boolean

  constructor() {
  }

  verifieCle(expectedPub) {
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
          console.log(expectedPub)
          if (expectedPub === pub) {
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

}
