
export default function authMiddleware({ next, router }) {
  let userStorageName = process.env.VUE_APP_STORAGE_NAME + '_user_';

  if (!localStorage.getItem(userStorageName + 'email') && !sessionStorage.getItem(userStorageName + 'email')) {
    return router.push("/login");
  }

  return next();
}