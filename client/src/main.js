import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import helpers from './plugins/helpers';

import './assets/css/index.css';

Vue.config.productionTip = false;

const helper = {
  install () {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  }
}

Vue.use(helper);

const userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_';

Vue.directive('can', (el, binding, vnode) => {
  let userPermissions = localStorage.getItem(userStorageName + 'permissions')
      ? localStorage.getItem(userStorageName + 'permissions')
      : sessionStorage.getItem(userStorageName + 'permissions');

  userPermissions = Vue.helpers.decrypt(userPermissions);

  if(userPermissions.includes(binding.value)) {
    return vnode.elm.hidden = false;
  } else {
    return vnode.elm.hidden = true;
  }
});

Vue.directive('is', (el, binding, vnode) => {
  let userRoles = localStorage.getItem(userStorageName + 'roles')
      ? localStorage.getItem(userStorageName + 'roles')
      : sessionStorage.getItem(userStorageName + 'roles');

  userRoles = Vue.helpers.decrypt(userRoles);

  if(userRoles.indexOf(binding.value) !== -1) {
    return vnode.elm.hidden = false;
  } else {
    return vnode.elm.hidden = true;
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
