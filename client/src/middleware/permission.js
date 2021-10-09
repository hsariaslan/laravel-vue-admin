import helpers from '@/plugins/helpers';

function checkUserPermissions(permission) {
  const userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_';
  const isAdmin = localStorage.getItem(userStorageName + 'roles')
    ? localStorage.getItem(userStorageName + 'roles')
    : sessionStorage.getItem(userStorageName + 'roles');
    
  if(isAdmin === 'admin') {
    return true;
  } else {
    let r = false;
    let userPermissions = localStorage.getItem(userStorageName + 'permissions')
      ? localStorage.getItem(userStorageName + 'permissions')
      : sessionStorage.getItem(userStorageName + 'permissions');

    if (!userPermissions) {
      return r;
    }

    userPermissions = helpers.decrypt(userPermissions);

    if(userPermissions.includes(permission)) {
      r = true;
    }

    return r;
  }
}

export default function permission (router) {
  router.beforeEach((to, from, next) => {
    if (to.meta.permission) {
      let checkPermission = checkUserPermissions(to.meta.permission);

      if(!checkPermission) {
        return router.push(from.path);
      }
    }
  
    return next();
  });
}