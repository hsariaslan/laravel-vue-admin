import axios from 'axios';
import helpers from '@/plugins/helpers';

const auth = {
  namespaced: true,

  state: () => ({
    login: false
  }),

  getters: {
    login: state => {
      return state.login;
    },
  },

  mutations: {
    login(state, user) {
      state.login = user;
    },

    logout(state) {
      state.login = false;
    }
  },

  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_SERVER_URL + '/sanctum/csrf-cookie').then(() => {
          axios.post('/login', {
            email: credentials.email,
            password: credentials.password
          })
          .then((response) => {
            let user = response.data.data;
            const roles  = String(helpers.decrypt(user.roles)).split(',');
            const permissions  = String(helpers.decrypt(user.permissions)).split(',');

            if(!(roles.includes("admin")) && !(permissions.includes("login_to_panel"))) {
              return Promise.reject({
                response: {
                  status: 403,
                  data: {
                    message: 'You are not authorized to login.',
                  },
                },
              });
            }

            const userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_';
            
            if(credentials.rememberMe === true) {
              localStorage.setItem(userStorageName + 'username', user.username);
              localStorage.setItem(userStorageName + 'email', user.email);
              localStorage.setItem(userStorageName + 'name', user.name);
              localStorage.setItem(userStorageName + 'surname', user.surname);
              localStorage.setItem(userStorageName + 'roles', user.roles);
              localStorage.setItem(userStorageName + 'permissions', user.permissions);
              sessionStorage.removeItem(userStorageName + 'username');
              sessionStorage.removeItem(userStorageName + 'email');
              sessionStorage.removeItem(userStorageName + 'name');
              sessionStorage.removeItem(userStorageName + 'surname');
              sessionStorage.removeItem(userStorageName + 'roles');
              sessionStorage.removeItem(userStorageName + 'permissions');
            } else {
              sessionStorage.setItem(userStorageName + 'username', user.username);
              sessionStorage.setItem(userStorageName + 'email', user.email);
              sessionStorage.setItem(userStorageName + 'name', user.name);
              sessionStorage.setItem(userStorageName + 'surname', user.surname);
              sessionStorage.setItem(userStorageName + 'roles', user.roles);
              sessionStorage.setItem(userStorageName + 'permissions', user.permissions);
              localStorage.removeItem(userStorageName + 'username');
              localStorage.removeItem(userStorageName + 'email');
              localStorage.removeItem(userStorageName + 'name');
              localStorage.removeItem(userStorageName + 'surname');
              localStorage.removeItem(userStorageName + 'roles');
              localStorage.removeItem(userStorageName + 'permissions');
            }

            user = helpers.getUserDataFromStorage();

            // console.log(user);
            commit('login', user);
            resolve('/');
          })
          .catch((error) => {
            reject(error);
          });
        });
      });
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        axios.post('/logout')
        .then(() => {
          let userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_';
          localStorage.removeItem(userStorageName + 'username');
          localStorage.removeItem(userStorageName + 'email');
          localStorage.removeItem(userStorageName + 'name');
          localStorage.removeItem(userStorageName + 'surname');
          localStorage.removeItem(userStorageName + 'roles');
          localStorage.removeItem(userStorageName + 'permissions');
          sessionStorage.removeItem(userStorageName + 'username');
          sessionStorage.removeItem(userStorageName + 'email');
          sessionStorage.removeItem(userStorageName + 'name');
          sessionStorage.removeItem(userStorageName + 'surname');
          sessionStorage.removeItem(userStorageName + 'roles');
          sessionStorage.removeItem(userStorageName + 'permissions');

          commit('logout');
          resolve('/login');
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
  },
}

export default auth;