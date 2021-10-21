import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/auth";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    breadcrumbTitle: ''
  },

  getters: {
    breadcrumbTitle: state => {
      return state.breadcrumbTitle;
    },
  },

  mutations: {
    breadcrumbTitle(state, title) {
      state.breadcrumbTitle = title;
    },
  },

  actions: {
    breadcrumbTitle({ commit }, title) {
      commit('breadcrumbTitle', title);
    },
  },

  modules: {
    auth,
  }
})
