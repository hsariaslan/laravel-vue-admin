import auth from '@/middleware/auth';

const authRoutes = {
  path: '/',
  component: () => import('@/views/layouts/Auth.vue'),
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
    },

    {
      path: 'forget-password',
      name: 'ForgetPassword',
      component: () => import('@/views/auth/ForgetPassword.vue'),
    },
  ],
};

const users = {
  path: '/users',
  component: () => import('@/views/layouts/Dashboard.vue'),
  children: [
    {
      path: '',
      name: 'Users',
      component: () => import('@/views/users/Users.vue'),
      meta: {
        middleware: auth,
        permission: 'list_users',
      },
    },

    {
      path: 'new',
      name: 'NewUser',
      component: () => import('@/views/users/New.vue'),
      meta: {
        middleware: auth,
        permission: 'create_user',
      },
    },

    {
      path: ':id',
      name: 'ShowUser',
      component: () => import('@/views/users/Show.vue'),
      meta: {
        middleware: auth,
        permission: 'show_user',
      },
    },

    {
      path: ':id/edit',
      name: 'EditUser',
      component: () => import('@/views/users/Edit.vue'),
      meta: {
        middleware: auth,
        permission: 'update_user',
      },
    },
  ],
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/views/layouts/Dashboard.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          middleware: auth,
          permission: 'show_dashboard',
        },
      },

      {
        path: 'logout',
        name: 'Logout',
        component: () => import('@/views/auth/Logout.vue'),
        meta: {
          middleware: auth,
        },
      },

      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          middleware: auth,
        },
      },

      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/Roles.vue'),
        meta: {
          middleware: auth,
          permission: 'list_roles',
        },
      },

      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('@/views/Permissions.vue'),
        meta: {
          middleware: auth,
          permission: 'list_permissions',
        },
      },
    ],
  },
  authRoutes,
  users,
];

export default routes;