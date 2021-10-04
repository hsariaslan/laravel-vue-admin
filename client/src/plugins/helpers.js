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
};