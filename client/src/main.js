import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import helpers from './plugins/helpers'

import './assets/css/index.css'

Vue.config.productionTip = false

Vue.directive('can', (el, binding, vnode) => {
  let userPermissions = localStorage.getItem(process.env.VUE_APP_STORAGE_NAME + '_user_permissions')
  if(typeof(userPermissions) === 'undefined' || userPermissions === null || userPermissions === 'null' || userPermissions === '') {
    userPermissions = sessionStorage.getItem(process.env.VUE_APP_STORAGE_NAME + '_user_permissions')
  }

  if(userPermissions.split(',').indexOf(binding.value) !== -1) {
     return vnode.elm.hidden = false;
  } else {
     return vnode.elm.hidden = true;
  }
})

Vue.directive('is', (el, binding, vnode) => {
  let userRoles = localStorage.getItem(process.env.VUE_APP_STORAGE_NAME + '_user_roles')
  if(typeof(userRoles) === 'undefined' || userRoles === null || userRoles === 'null' || userRoles === '') {
    userRoles = sessionStorage.getItem(process.env.VUE_APP_STORAGE_NAME + '_user_roles')
  }

  if(userRoles.split(',').indexOf(binding.value) !== -1) {
     return vnode.elm.hidden = false;
  } else {
     return vnode.elm.hidden = true;
  }
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

const helper = {
  install () {
    Vue.helpers = helpers
    Vue.prototype.$helpers = helpers
  }
}

Vue.use(helper)