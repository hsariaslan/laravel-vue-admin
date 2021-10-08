import Vue from 'vue'
import VueRouter from 'vue-router'

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
      component: Users
    },
    {
      path: 'new',
      name: 'NewUser',
      component: NewUser
    },
    {
      path: ':id',
      name: 'ShowUser',
      component: ShowUser
    },
    {
      path: ':id/edit',
      name: 'EditUser',
      component: EditUser
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
      },
      {
        path: '/logout',
        name: 'Logout',
        component: Logout,
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
      }
    ]
  },
  auth,
  users,
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router
