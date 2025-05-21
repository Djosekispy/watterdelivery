// shim.js
import 'react-native-get-random-values';
import { polyfillWebCrypto } from 'expo-standard-web-crypto';

polyfillWebCrypto();

if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto;
}
