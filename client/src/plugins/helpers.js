import CryptoJS from "crypto-js";

export default {
  makeHash(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  isNull(variable) {
    if(typeof(variable) === 'undefined' || variable === null || variable === 'null' || variable === '' || variable == [] || variable.length == 0) {
      return true
    } else {
      return false
    }
  },

  isNotNull(variable) {
    if(typeof(variable) !== 'undefined' && variable !== null && variable !== 'null' && variable !== '') {
      return true
    } else {
      return false
    }
  },

  decrypt(data) {
    const key         = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_API_CRYPT_KEY)
    let decrypt       = CryptoJS.AES.decrypt(data, key, { mode: CryptoJS.mode.ECB });
    let stringDecrypt = decrypt.toString(CryptoJS.enc.Utf8);
    let decrypted     = stringDecrypt.replace(/^\[+|\"+|\{+|\[+|\]+|\}+|\\+|u0000+|\*+|items+|\:+|\]+$/g, '').split(','); // replaces string type of array data to real array
    return decrypted
  },
};