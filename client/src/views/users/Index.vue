<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="datas"
      :search="tableSearch"
      sort-by="no"
      dense
      class="elevation-1"
      :items-per-page="25"
      :footer-props="{ itemsPerPageOptions: [10, 15,  25,  50, 100, -1,] }"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            to="/users/new"
            v-can="'create_user'"
          >
            New User
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="tableSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this user?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <template>
                  <v-btn color="blue darken-1" text @click="toggleDialog('-1')">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteData">
                    OK
                  </v-btn>
                </template>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>
      
      <template v-slot:item.no="{ item }">
        {{ datas.indexOf(item) + 1 }}
        <span v-if="loggedUser.email == item.email">
          <v-icon small title="This is your account" class="tw-text-yellow-600 hover:tw-text-indigo-500">mdi-information</v-icon>
        </span>
      </template>

      <template v-slot:item.roles="{ item }">
        <div class="tw-flex-wrap">
          <span
            v-for="(role, idx) in item.roles"
            :key="idx"
            :style="`background-color:#${role.color}; color:${$helpers.colorLightOrDark(role.color.substr(1,6))}`"
            class="chip"
          >{{ role.display_name }}</span>
        </div>
      </template>

      <template v-slot:item.permissions="{ item }">
        <div class="tw-flex-wrap tw-items-center">
          <div v-if="item.permissions.length > 0" class="tw-float-left tw-cursor-help">
            <v-icon small color="orange" title="Direct permissions defined to this user">mdi-alert-circle-outline</v-icon>
          </div>
          <div v-if="item.roles[0].display_name === 'Admin'" class="tw-float-left">
            <i>All permissions</i>
            <i v-if="item.all_permissions.length > 0" class="tw-text-red-500 tw-text-xs">
              (Defining roles or permissions for this user are unnecessary since an admin already has all permissions)
            </i>
          </div>
          <div
            v-for="(permission, idx) in item.all_permissions"
            :key="idx"
            class="tw-float-left"
          >
            <div v-if="!expandedPermissions.includes(datas.indexOf(item))">
              <span
                v-if="idx < displayingPermissionsPerRow"
                class="chip tw-bg-gray-200"
              >
                {{ permission.display_name }}
              </span>
              <span
                v-else-if="idx === displayingPermissionsPerRow"
                class="chip tw-cursor-pointer tw-bg-blue-200 hover:tw-bg-white"
                @click="expandPermissions(datas.indexOf(item))"
              >
                {{ item.all_permissions.length - idx }} more...
              </span>
            </div>
            <div v-else>
              <span class="chip tw-bg-gray-200 tw-float-left">
                {{ permission.display_name }}
              </span>
              <span
                v-if="idx === item.all_permissions.length - 1"
                class="chip tw-float-left tw-cursor-pointer tw-bg-red-200 hover:tw-bg-white"
                @click="collapsePermissions(datas.indexOf(item))"
              >
                collapse
              </span>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div v-if="loggedUser.email == item.email" class="tw-flex tw-items-end tw-justify-end">
          <router-link :to="`/profile`">
            <v-icon small title="Show your profile" class="hover:tw-text-blue-500">mdi-account</v-icon>
          </router-link>
        </div>
        <div v-else class="tw-flex tw-items-end tw-justify-end">
          <div class="tw-float-left">
            <router-link :to="`/users/${item.id}`" v-can="'show_user'">
              <v-icon small title="Show" class="hover:tw-text-blue-500">mdi-eye</v-icon>
            </router-link>
          </div>
          <div class="tw-float-left tw-ml-2" v-can="'update_user'" v-if="loggedUser.roles[0][1] === 'admin' || loggedUser.roles[0][4] < item.roles[0].scope">
            <router-link :to="`/users/${item.id}/edit`">
            <v-icon small title="Edit" class="hover:tw-text-green-500">mdi-pencil</v-icon>
          </router-link>
          </div>
          <div class="tw-float-left tw-ml-2" v-can="'delete_user'" v-if="loggedUser.roles[0][1] === 'admin' || loggedUser.roles[0][4] < item.roles[0].scope">
            <v-icon small title="Delete" @click="toggleDialog(datas.indexOf(item))" class="hover:tw-text-red-500">mdi-delete</v-icon>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import axios from 'axios';

  export default {
    name: 'Users',
    data: () => ({
      datas:[],
      headers: [
        { text: 'No',           value: 'no', },
        { text: 'Name',         value: 'name', },
        { text: 'Surname',      value: 'surname', },
        { text: 'Username',     value: 'username' },
        { text: 'Email',        value: 'email' },
        { text: 'Roles',        value: 'roles' },
        { text: 'Permissions',  value: 'permissions', sortable: false },
        { text: 'Actions',      value: 'actions',     sortable: false, align: 'right' },
      ],
      tableSearch: '',
      loading: true,
      displayingPermissionsPerRow: 3,
      expandedPermissions: [],
      dialog: false,
      deletingIndex: -1,
    }),

    created () {
      axios.get('http://localhost:8000/api/v1/users')
      .then((response) => {
        this.datas = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
    },

    methods: {
      deleteData() {
        let deletingDataId = this.datas[this.deletingIndex].id;

        axios.delete('http://localhost:8000/api/v1/users/' + deletingDataId)
        .then(() => {
          this.datas.splice(this.deletingIndex, 1);
          this.toggleDialog();
        })
        .catch((error) => {
          console.log(error);
        });
      },

      expandPermissions(index) {
        if(!this.expandedPermissions.includes(index)) {
          this.expandedPermissions.push(index);
        }
      },

      collapsePermissions(index) {
        index = this.expandedPermissions.indexOf(index);
        this.expandedPermissions.splice(index, 1);
      },

      toggleDialog(index) {
        this.dialog = !this.dialog;
        if(index !== '-1') {
          this.deletingIndex = index;
        }
      },
    },

    computed: {
      ...mapGetters({loggedUser: 'auth/login'})
    },
  }
</script>
