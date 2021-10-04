import axios from 'axios'
axios.defaults.withCredentials = true;

const auth = {
  namespaced: true,

  state: () => ({
    login           : false,
    username        : null,
    password        : null,
    rememberMe      : false,
    errors          : [],
    loginAttempts   : {
      current : 0,
      captcha : 3,
      limit   : 5,
    },
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

    loginAttempts: state => {
      return state.loginAttempts.current
    },

    errors: state => {
      return state.errors
    },
  },

  mutations: {
    login(state, payload) {
      // state.login = payload
      state.login = {
        'id'          : payload.id,
        'username'    : payload.username,
        'roles'       : payload.roles,
        'permissions' : payload.permissions,
        'image'       : payload.image,
      }
    },

    invalidLogin(state, payload) {
      state.errors = {
        'code'    : payload.code,
        'message' : payload.message,
      }
    },

    logout(state, payload) {
      state.login = false
    },

    errors(state, errors) {
      state.errors = errors
    },

    increaseLoginAttempt(state, payload) {
      state.loginAttempts.current ++
    },

    tooManyLoginAttempts(state, payload) {
      state.errors.push({
        'user'    : payload.user.id,
        'code'    : payload.code,
        'message' : payload.message,
      })
    },

    resetLoginAttempts(state, payload) {
      state.loginAttempts.current = 0
    },
  },

  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_SERVER_URL + '/sanctum/csrf-cookie').then(response => {
          axios.post(process.env.VUE_APP_API_URL + '/login', {
            email: credentials.email,
            password: credentials.password
          })

          .then((response) => {
            commit('login', credentials)
            resolve('/')
          })
          
          .catch((error) => {
            reject(error)
          })
        })
      })
    },

    logout({ commit }, user) {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      commit('logout', user)
    },

    pushError({ commit }, errors) {
      commit('errors', errors)
    },
  },
}

export default auth