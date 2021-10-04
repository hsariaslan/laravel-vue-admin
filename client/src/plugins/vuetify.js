import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#6366F1', // tw-indigo-500
        secondary: '#EF4444', // tw-red-500
      },
    },
  },
});
