import CryptoJS from "crypto-js";

export default {
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

  isArrayOfObjects(variable) {
    if(Array.isArray(variable) && typeof(variable[0]) === 'object' && variable !== null) {
      return true;
    } else {
      return false;
    }
  },

  isObject(variable) {
    if(typeof(variable) === 'object' && variable !== null) {
      return true;
    } else {
      return false;
    }
  },

  stringToSlug (str) {
    str = str.toString()
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
  
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '-');
    return str;
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
        user.email        = this.decrypt(userEmail).toString()
        user.username     = this.decryptStorageData(userStorageNamePrefix + 'username').toString();
        user.name         = this.decryptStorageData(userStorageNamePrefix + 'name').toString();
        user.surname      = this.decryptStorageData(userStorageNamePrefix + 'surname').toString();
        user.roles        = this.decryptStorageData(userStorageNamePrefix + 'roles');
        user.permissions  = this.decryptStorageData(userStorageNamePrefix + 'permissions');
      }
    } else {
      user.email          = this.decrypt(userEmail).toString()
      user.username       = this.decryptStorageData(userStorageNamePrefix + 'username',     'local').toString();
      user.name           = this.decryptStorageData(userStorageNamePrefix + 'name',         'local').toString();
      user.surname        = this.decryptStorageData(userStorageNamePrefix + 'surname',      'local').toString();
      user.roles          = this.decryptStorageData(userStorageNamePrefix + 'roles',        'local');
      user.permissions    = this.decryptStorageData(userStorageNamePrefix + 'permissions',  'local');
    }

    let roles = [];
    let i = 0, j = 0;
    roles.push([]);

    if(this.isNotNull(user.roles)) {
      user.roles.forEach(value => {
        if(i === 0 && j === 0) {
          roles[0].push(value);
        } else if(j % 5 !== 0) {
          roles[i].push(value);
        } else {
          i ++;
          j = 0;
          roles.push([]);
          roles[i].push(value);
        }
        j ++;
      });
    }

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

  colorLightOrDark(color) {
    color = color.substring(1); // strip #
    let rgb = parseInt(color, 16);  // convert rrggbb to decimal
    let r = (rgb >> 16) & 0xff; // extract red
    let g = (rgb >>  8) & 0xff; // extract green
    let b = (rgb >>  0) & 0xff; // extract blue

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma > 150) {
      return "#333333";  // given color is light. return dark color
    }

    return "#FFFFFF";  // given color is dark. return light color
  },

  makeHash(length) {
    const characters        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength  = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
};
