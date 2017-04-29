import {Injectable} from "@angular/core";
const scrypt = require('scrypt-async')
const tweetnacl = require('tweetnacl')
const tweetnaclUtil = require('tweetnacl-util')

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
        return tweetnacl.sign.keyPair.fromSeed(byteseed)
      })
  }

}
