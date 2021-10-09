import Vue from 'vue';
import VueRouter from 'vue-router';
import authMiddleware from '../middleware/auth.js';

const auth = {
  path: '/',
  component: () => import('../views/layouts/Auth.vue'),
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('../views/auth/Login.vue'),
    },

    {
      path: 'forget-password',
      name: 'ForgetPassword',
      component: () => import('../views/auth/ForgetPassword.vue'),
    },
  ],
};

const users = {
  path: '/users',
  component: () => import('../views/layouts/Dashboard.vue'),
  children: [
    {
      path: '',
      name: 'Users',
      component: () => import('../views/users/Users.vue'),
      meta: {
        middleware: authMiddleware,
      },
    },

    {
      path: 'new',
      name: 'NewUser',
      component: () => import('../views/users/New.vue'),
      meta: {
        middleware: authMiddleware,
      },
    },

    {
      path: ':id',
      name: 'ShowUser',
      component: () => import('../views/users/Show.vue'),
      meta: {
        middleware: authMiddleware,
      },
    },

    {
      path: ':id/edit',
      name: 'EditUser',
      component: () => import('../views/users/Edit.vue'),
      meta: {
        middleware: authMiddleware,
      },
    },
  ],
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('../views/layouts/Dashboard.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          middleware: authMiddleware,
        },
      },

      {
        path: 'logout',
        name: 'Logout',
        component: () => import('../views/auth/Logout.vue'),
        meta: {
          middleware: authMiddleware,
        },
      },

      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: {
          middleware: authMiddleware,
        },
      },

      {
        path: 'roles',
        name: 'Roles',
        component: () => import('../views/Roles.vue'),
        meta: {
          middleware: authMiddleware,
        },
      },

      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('../views/Permissions.vue'),
        meta: {
          middleware: authMiddleware,
        },
      },
    ],
  },
  auth,
  users,
];

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  
  if (!subsequentMiddleware) {
    return context.next;
  }

  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router;
