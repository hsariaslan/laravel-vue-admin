import Vue from 'vue'
import axios from 'axios'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

const auth = {
  namespaced: true,

  state: () => ({
    login       : false,
    username    : null,
    password    : null,
    rememberMe  : false,
    errors      : [],
  }),

  getters: {
    login: state => {
      return state.login
    },

    username: state => {
      return state.username
    },

    password: state => {
      return state.password
    },

    rememberMe: state => {
      return state.rememberMe
    },

    errors: state => {
      return state.errors
    },
  },

  mutations: {
    login(state, payload) {
      state.login = payload
      // console.log(state.login)
    },

    logout(state) {
      state.login = false
    },

    errors(state, errors) {
      state.errors = errors
    },
  },

  actions: {
    login({ }, credentials) {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_SERVER_URL + '/sanctum/csrf-cookie').then(() => {
          axios.post('/login', {
            email: credentials.email,
            password: credentials.password
          })
          .then((response) => {
            let user = response.data.data
            console.log(user)
            let userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_'
            if(credentials.rememberMe === true) {
              localStorage.setItem(userStorageName + 'username', user.username)
              localStorage.setItem(userStorageName + 'email', user.email)
              localStorage.setItem(userStorageName + 'name', user.name)
              localStorage.setItem(userStorageName + 'surname', user.surname)
              localStorage.setItem(userStorageName + 'roles', user.roles)
              localStorage.setItem(userStorageName + 'permissions', user.permissions)
              sessionStorage.removeItem(userStorageName + 'username')
              sessionStorage.removeItem(userStorageName + 'email')
              sessionStorage.removeItem(userStorageName + 'name')
              sessionStorage.removeItem(userStorageName + 'surname')
              sessionStorage.removeItem(userStorageName + 'roles')
              sessionStorage.removeItem(userStorageName + 'permissions')
            } else {
              sessionStorage.setItem(userStorageName + 'username', user.username)
              sessionStorage.setItem(userStorageName + 'email', user.email)
              sessionStorage.setItem(userStorageName + 'name', user.name)
              sessionStorage.setItem(userStorageName + 'surname', user.surname)
              sessionStorage.setItem(userStorageName + 'roles', user.roles)
              sessionStorage.setItem(userStorageName + 'permissions', user.permissions)
              localStorage.removeItem(userStorageName + 'username')
              localStorage.removeItem(userStorageName + 'email')
              localStorage.removeItem(userStorageName + 'name')
              localStorage.removeItem(userStorageName + 'surname')
              localStorage.removeItem(userStorageName + 'roles')
              localStorage.removeItem(userStorageName + 'permissions')
            }
            resolve('/')
          })
          .catch((error) => {
            reject(error)
          })
        })
      })
    },

    profile({ }) {
      return new Promise((resolve, reject) => {
        axios.post('/profile').then((response) => {
          let user = response.data.data
          if(credentials.rememberMe === true) {
            localStorage.setItem('user', user)
            sessionStorage.removeItem('user')
          } else {
            sessionStorage.setItem('user', user)
            localStorage.removeItem('user')
          }
        })
        .then(() => {
          resolve('/')
        })
        .catch((error) => {
          reject(error)
        })
      })
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        axios.post('/logout')
        .then(() => {
          let userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_'
          localStorage.removeItem(userStorageName + 'username')
          localStorage.removeItem(userStorageName + 'email')
          localStorage.removeItem(userStorageName + 'name')
          localStorage.removeItem(userStorageName + 'surname')
          localStorage.removeItem(userStorageName + 'roles')
          localStorage.removeItem(userStorageName + 'permissions')
          sessionStorage.removeItem(userStorageName + 'username')
          sessionStorage.removeItem(userStorageName + 'email')
          sessionStorage.removeItem(userStorageName + 'name')
          sessionStorage.removeItem(userStorageName + 'surname')
          sessionStorage.removeItem(userStorageName + 'roles')
          sessionStorage.removeItem(userStorageName + 'permissions')
          commit('logout')
          resolve('/login')
        })
        .catch((error) => {
          reject(error)
        })
      })
    },

    pushError({ commit }, errors) {
      commit('errors', errors)
    },
  },
}

export default auth
