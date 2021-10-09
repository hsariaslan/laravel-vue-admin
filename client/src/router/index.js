import Vue from 'vue'
import VueRouter from 'vue-router'

import authMiddleware from '../middleware/auth.js'

import DashboardLayout from '../views/layouts/Dashboard.vue'
import AuthLayout from '../views/layouts/Auth.vue'

import Dashboard from '../views/Dashboard.vue'

import Login from '../views/auth/Login.vue'
import ForgetPassword from '../views/auth/ForgetPassword.vue'
import Logout from '../views/auth/Logout.vue'

import Profile from '../views/Profile.vue'

import Users from '../views/users/Users.vue'
import ShowUser from '../views/users/Show.vue'
import NewUser from '../views/users/New.vue'
import EditUser from '../views/users/Edit.vue'

import Roles from '../views/Roles.vue'
import Permissions from '../views/Permissions.vue'

let users = {
  path: '/users',
  component: DashboardLayout,
  children: [
    {
      path: '',
      name: 'Users',
      component: Users,
      meta: {
        middleware: authMiddleware,
      },
    },
    {
      path: 'new',
      name: 'NewUser',
      component: NewUser,
      meta: {
        middleware: authMiddleware,
      },
    },
    {
      path: ':id',
      name: 'ShowUser',
      component: ShowUser,
      meta: {
        middleware: authMiddleware,
      },
    },
    {
      path: ':id/edit',
      name: 'EditUser',
      component: EditUser,
      meta: {
        middleware: authMiddleware,
      },
    },
  ]
}

let auth = {
  path: '/',
  name: 'Auth',
  component: AuthLayout,
  children: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/forget-password',
      name: 'ForgetPassword',
      component: ForgetPassword,
    }
  ]
}

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        components: { default: Dashboard },
        meta: {
          middleware: authMiddleware,
        },
      },
      {
        path: '/logout',
        name: 'Logout',
        component: Logout,
        meta: {
          middleware: authMiddleware,
        },
      },
    ]
  },
  {
    path: '/profile',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Profile',
        component: Profile,
        meta: {
          middleware: authMiddleware,
        },
      }
    ]
  },
  {
    path: '/roles',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Roles',
        component: Roles,
        meta: {
          middleware: authMiddleware,
        },
      }
    ]
  },
  {
    path: '/permissions',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Permissions',
        component: Permissions,
        meta: {
          middleware: authMiddleware,
        },
      }
    ]
  },
  auth,
  users,
];

Vue.use(VueRouter)

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

export default router
