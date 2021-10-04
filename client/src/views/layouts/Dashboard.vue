<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="tw-bg-sideBar-700 tw-border-r-1 tw-border-sideBar-400"
    >
      <v-list-item class="tw-h-16 tw-bg-sideBar-800 tw-border-b-0">
        <v-list-item-content>
          <router-link to="/" class="logo-link">
            <v-list-item-title class="logo-text-lg tw-transition-all tw-text-white tw-text-xl">
              Vue Admin
            </v-list-item-title>
            <v-list-item-subtitle class="logo-text-sm tw-transition-all tw-text-trueGray-550 tw-text-xs">
              An open source cms panel
            </v-list-item-subtitle>
          </router-link>
        </v-list-item-content>
      </v-list-item>
      <Menu :items="menuLinks" />
    </v-navigation-drawer>
    <v-app-bar
      app
      absolute
      class="tw-h-16 tw-bg-sideBar-800 tw-text-trueGray-550"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" color="grey"></v-app-bar-nav-icon>
      <v-toolbar-title class="tw-pl-0 tw-text-base">
        <Breadcrumbs />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        color="grey"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        icon
        color="grey" 
        @click="settings = !settings"
      >
        <v-icon >mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-expand-transition>
      <v-card
        v-show="settings"
        class="mx-auto tw-absolute tw-top-16 tw-right-0 tw-bg-sideBar-700 tw-text-trueGray-550 tw-border-0 tw-rounded-b-md tw-rounded-t-none tw-z-10"
      >
        <div>
          <v-navigation-drawer
          dark
            class="tw-bg-transparent tw-w-full"
          >
            <v-divider></v-divider>
            <router-link to="/profile" class="profile" @click="settings = false">
              <img src="@/assets/img/profile.jpg" alt="profile.jpg" class="profile-img">
              <span>Hakan Sarıaslan</span>
              <v-icon color="grey" class="tw-w-4">mdi-circle-small</v-icon>
              <span class="tw-text-red-500 tw-font-medium">Admin</span>
            </router-link>
            <v-divider></v-divider>
            <Menu :items="profileLinks" @click="settings = false" />
          </v-navigation-drawer>
        </div>
      </v-card>
    </v-expand-transition>
    <v-main>
      <router-view class="tw-p-4 tw-shadow-none"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import Menu from '@/components/Menu.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
export default {
  name: 'Layout',
  components: {
    Menu,
    Breadcrumbs,
  },
  data () {
    return {
      drawer: null,
      settings: false,
      menuLinks: [
        {
          title: 'Dashboard',
          link: '/dashboard',
          icon: 'mdi-monitor-dashboard'
        },
        {
          title: 'Users',
          link: '/users',
          icon: 'mdi-account-group'
        },
        {
          title: 'Roles',
          link: '/roles',
          icon: 'mdi-account-details'
        },
        {
          title: 'Permissions',
          link: '/permissions',
          icon: 'mdi-account-check'
        },
      ],
      profileLinks: [
        {
          title: 'Profile',
          link: '/profile',
          icon: 'mdi-account'
        },
        {
          title: 'Logout',
          link: '/logout',
          icon: 'mdi-logout'
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['auth/login']),
  },
  created() {
    // let token = localStorage.getItem('token')
    // if(typeof(token) === 'undefined' || token === null || token === 'null' || token === '') {
    //   token = sessionStorage.getItem('token')
    //   if(typeof(token) === 'undefined' || token === null || token === 'null' || token === '') {
    //     this.$router.push("/login")
    //   }
    // }
  }
};
</script>

<style scoped>
.v-application {
  font-family: Quicksand !important
}
</style>
