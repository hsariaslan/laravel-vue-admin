import store from '@/store';
import axios from 'axios';
import helpers from '@/plugins/helpers';
import permissionDirectives from '@/plugins/permissionDirectives';

export default function auth({ next, router }) {
  const userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_';

  if (!localStorage.getItem(userStorageName + 'email') && !sessionStorage.getItem(userStorageName + 'email')) {
    router.push('login');
  }
  
  if(store.getters["auth/login"] === false ) {
    const userDatas = helpers.getUserDataFromStorage();
    store.commit('auth/login', userDatas);
    
  }

  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if(error.response.status === 401) {
      router.push('logout');
    }
    return Promise.reject(error);
  });

  const user = store.getters["auth/login"];
  permissionDirectives(user);

  return next();
}