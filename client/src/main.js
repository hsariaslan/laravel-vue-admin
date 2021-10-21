import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import helpers from './plugins/helpers';
import axios from 'axios';

import './assets/css/index.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

Vue.config.productionTip = false;

const helper = {
  install () {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  }
}

Vue.use(helper);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');