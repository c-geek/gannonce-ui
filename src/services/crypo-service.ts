import {Injectable} from "@angular/core";
const scrypt = require('scrypt-async')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')
const base58 = require('../lib/base58')

@Injectable()
export class CryptoService {

  constructor() {
  }

  getKeyPair(salt, passwd) {
    return new Promise((res) => {
      scrypt(passwd, salt, {
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
        return this.keypairFromSeed(byteseed)
      })
  }

  keypairFromSeed(byteseed) {
    return tweetnacl.sign.keyPair.fromSeed(byteseed)
  }

  loadFromFile($event, withPrivate) {
    return new Promise((resolve, reject) => {
      const file:File = $event.target.files[0];
      const myReader:FileReader = new FileReader();
      myReader.onloadend = function (loadEvent:any) {
        const content = loadEvent.currentTarget.result
        const pubMatch = content.match(/^pub: ([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44})\n/)
        if (!pubMatch) {
          return reject('Fichier incorrect : clé publique non trouvée')
        }
        if (!withPrivate) {
          return resolve({
            publicKey: base58.decode(pubMatch[1])
          })
        }
        const secMatch = content.match(/\nsec: ([123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{86,88})\n?$/)
        if (!secMatch) {
          return reject('Fichier incorrect : clé privée non trouvée')
        }
        return resolve({
          publicKey: base58.decode(pubMatch[1]),
          secretKey: base58.decode(secMatch[1]),
        })
      };
      myReader.readAsText(file, 'utf8');
    })
  }
}
