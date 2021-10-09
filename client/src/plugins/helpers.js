import CryptoJS from "crypto-js";

export default {
  makeHash(length) {
    const characters        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength  = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  isNull(variable) {
    if(typeof(variable) === 'undefined' || variable === null || variable === 'null' || variable === '' || variable == [] || variable.length == 0) {
      return true;
    } else {
      return false;
    }
  },

  isNotNull(variable) {
    if(typeof(variable) !== 'undefined' && variable !== null && variable !== 'null' && variable !== '') {
      return true;
    } else {
      return false;
    }
  },

  decrypt(data) {
    const key         = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_API_CRYPT_KEY);
    let decrypt       = CryptoJS.AES.decrypt(data, key, { mode: CryptoJS.mode.ECB });
    let stringDecrypt = decrypt.toString(CryptoJS.enc.Utf8);

    // replaces string type of array data to real array
    let decrypted     = stringDecrypt.replace(/^\[+|\"+|\{+|\[+|\]+|\}+|\\+|u0000+|\*+|items+|\:+|\]+$/g, '').split(',');

    return decrypted;
  },

  getUserDataFromStorage() {
    const userStorageNamePrefix = process.env.VUE_APP_STORAGE_NAME + '_user_';
    let user = {};
    let userEmail = localStorage.getItem(userStorageNamePrefix + 'email');

    if(this.isNull(userEmail)) {
      userEmail = sessionStorage.getItem(userStorageNamePrefix + 'email');

      if(this.isNotNull(userEmail)) {
        user.email        = this.decrypt(userEmail)
        user.username     = this.decryptStorageData(userStorageNamePrefix + 'username');
        user.name         = this.decryptStorageData(userStorageNamePrefix + 'name');
        user.surname      = this.decryptStorageData(userStorageNamePrefix + 'surname');
        user.roles        = this.decryptStorageData(userStorageNamePrefix + 'roles');
        user.permissions  = this.decryptStorageData(userStorageNamePrefix + 'permissions');
      }
    } else {
      user.email          = this.decrypt(userEmail)
      user.username       = this.decryptStorageData(userStorageNamePrefix + 'username',     'local');
      user.name           = this.decryptStorageData(userStorageNamePrefix + 'name',         'local');
      user.surname        = this.decryptStorageData(userStorageNamePrefix + 'surname',      'local');
      user.roles          = this.decryptStorageData(userStorageNamePrefix + 'roles',        'local');
      user.permissions    = this.decryptStorageData(userStorageNamePrefix + 'permissions',  'local');
    }

    let roles = [];
    let i = 0, j = 0;
    roles.push([]);

    user.roles.forEach(value => {
      if(i === 0 && j === 0) {
        roles[0].push(value);
      } else if(j % 3 !== 0) {
        roles[i].push(value);
      } else {
        i ++;
        j = 0;
        roles.push([]);
        roles[i].push(value);
      }
      j ++;
    });

    user.roles = roles;

    return user;
  },

  decryptStorageData(data, storageType = 'session') {
    if(storageType === 'local') {

      return this.decrypt(localStorage.getItem(data));
      
    } else if(storageType === 'session') {

      return this.decrypt(sessionStorage.getItem(data));

    }
  },
};
