import auth from '@/middleware/auth';
import DashboardLayout from '@/views/layouts/Dashboard.vue';

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
  component: DashboardLayout,
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

const roles = {
  path: '/roles',
  component: DashboardLayout,
  children: [
    {
      path: '',
      name: 'Roles',
      component: () => import('@/views/roles/Roles.vue'),
      meta: {
        middleware: auth,
        permission: 'list_roles',
      },
    },

    {
      path: 'new',
      name: 'NewRole',
      component: () => import('@/views/roles/New.vue'),
      meta: {
        middleware: auth,
        permission: 'create_role',
      },
    },

    {
      path: ':id',
      name: 'ShowRole',
      component: () => import('@/views/roles/Show.vue'),
      meta: {
        middleware: auth,
        permission: 'show_role',
      },
    },

    {
      path: ':id/edit',
      name: 'EditRole',
      component: () => import('@/views/roles/Edit.vue'),
      meta: {
        middleware: auth,
        permission: 'update_role',
      },
    },
  ],
};

const permissions = {
  path: '/permissions',
  component: DashboardLayout,
  children: [
    {
      path: '',
      name: 'Permissions',
      component: () => import('@/views/permissions/Permissions.vue'),
      meta: {
        middleware: auth,
        permission: 'list_permissions',
      },
    },

    {
      path: 'new',
      name: 'NewPermission',
      component: () => import('@/views/permissions/New.vue'),
      meta: {
        middleware: auth,
        permission: 'create_permission',
      },
    },

    {
      path: ':id',
      name: 'ShowPermission',
      component: () => import('@/views/permissions/Show.vue'),
      meta: {
        middleware: auth,
        permission: 'show_permission',
      },
    },

    {
      path: ':id/edit',
      name: 'EditPermission',
      component: () => import('@/views/permissions/Edit.vue'),
      meta: {
        middleware: auth,
        permission: 'update_permission',
      },
    },
  ],
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: DashboardLayout,
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
    ],
  },
  authRoutes,
  users,
  roles,
  permissions,
];

export default routes;