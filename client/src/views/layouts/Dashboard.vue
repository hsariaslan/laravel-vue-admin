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
              Laravel Vue Admin
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
          <v-navigation-drawer dark class="tw-bg-transparent tw-w-full">
            <v-divider></v-divider>
            <router-link to="/profile" class="profile" @click="settings = false">
              <img src="@/assets/img/profile.jpg" alt="profile.jpg" class="profile-img tw-w-12 tw-max-h-12">
              <span>{{user.name + ' ' + user.surname}}</span>
              <v-icon color="grey" class="tw-w-4">mdi-circle-small</v-icon>
              <div
                v-for="(role, id) in user.roles"
                :key="id"
              >
                <span class="tw-font-medium" :style="`color:#${role[3]}`">
                  {{ role[2] }}
                </span>
              </div>
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
      user: {},
      menuLinks: [],
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
  
  created() {
    this.user = this.$store.getters["auth/login"];
    // console.log(this.user.permissions);

    if(this.$helpers.isNotNull(this.user.permissions)) {
      this.user.permissions.forEach(permission => {
        switch(permission) {
          case 'show_dashboard': this.menuLinks.push({
            title: 'Dashboard',
            link: '/dashboard',
            icon: 'mdi-monitor-dashboard'
          }); break;

          case 'list_users' || 'create_user' || 'show_user' || 'update_user' || 'delete_user': this.menuLinks.push({
            title: 'Users',
            link: '/users',
            icon: 'mdi-account-group'
          }); break;

          case 'list_roles' || 'create_role' || 'show_role' || 'update_role' || 'delete_role': this.menuLinks.push({
            title: 'Roles',
            link: '/roles',
            icon: 'mdi-account-star'
          }); break;

          case 'list_permissions' || 'create_permission' || 'show_permission' || 'update_permission' || 'delete_permission': this.menuLinks.push({
            title: 'Permissions',
            link: '/permissions',
            icon: 'mdi-account-check'
          }); break;

          case 'list_permission_categories' || 'create_permission_category' || 'show_permission_category' || 'update_permission_category' || 'delete_permission_category': this.menuLinks.push({
            title: 'Permission Categories',
            link: '/permission-categories',
            icon: 'mdi-text-account'
          }); break;

          case 'list_permission_actions' || 'create_permission_action' || 'show_permission_action' || 'update_permission_action' || 'delete_permission_action': this.menuLinks.push({
            title: 'Permission Actions',
            link: '/permission-actions',
            icon: 'mdi-account-arrow-right'
          }); break;
        }
      });
    }
  }
};
</script>

<style scoped>
.v-application {
  font-family: Quicksand !important
}
</style>
