import 'es6-shim';
import 'es6-promise';
import 'uuid';
import 'tweetnacl';
import 'tweetnacl-util';
import 'scrypt-async';
import 'zone.js/dist/zone';
import 'reflect-metadata';
import '@angular/compiler';
import '@angular/platform-browser';
import {enableProdMode} from '@angular/core';
import 'rxjs';

const production: string = 'production';
if (production === 'BRUNCH_ENVIRONMENT') {
  enableProdMode();
}
