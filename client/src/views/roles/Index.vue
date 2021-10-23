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
            to="/roles/new"
            v-can="'create_role'"
          >New Role</v-btn>
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
              <v-card-title class="text-h5">Are you sure you want to delete this role?</v-card-title>
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
      </template>

      <template v-slot:header.scope="{ header }">
        <span>{{ header.text }}</span>
        <v-icon
          small
          title="Scope means how the relevant role has the permissions extensively. Lower number means higher scope. Lower scope roles can't execute the actions of higher scope roles."
          class="tw--mt-0.5 tw-ml-0.5"
        >mdi-help-circle-outline</v-icon>
      </template>

      <template v-slot:item.permissions="{ item }">
        <div class="tw-flex-wrap tw-items-center">
          <div v-if="item.display_name === 'Admin'" class="tw-float-left">
            <i>All permissions</i>
            <i v-if="item.permissions.length > 0" class="tw-text-red-500 tw-text-xs">
              (Defining permissions for admin is unnecessary since an admin already has all permissions)
            </i>
          </div>
          <div
            v-for="(permission, idx) in item.permissions"
            :key="idx"
            class="tw-m-1 tw-float-left"
          >
            <div v-if="!expandedPermissions.includes(datas.indexOf(item))">
              <div
                v-if="idx < displayingPermissionsPerRow"
                class="permission-in-table"
              >
                {{ permission.display_name }}
              </div>
              <div
                v-else-if="idx === displayingPermissionsPerRow"
                class="permission-in-table tw-cursor-pointer tw-bg-blue-200 hover:tw-bg-white"
                @click="expandPermissions(datas.indexOf(item))"
              >
                {{ item.permissions.length - idx }} more...
              </div>
            </div>
            <div v-else>
              <div class="permission-in-table tw-float-left">
                {{ permission.display_name }}
              </div>
              <div
                v-if="idx === item.permissions.length - 1"
                class="permission-in-table tw-ml-1 tw-float-left tw-cursor-pointer tw-bg-red-200 hover:tw-bg-white"
                @click="collapsePermissions(datas.indexOf(item))"
              >
                collapse
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:item.color="{ item }">
        <span
            :style="`background-color:${item.color}; color:${$helpers.colorLightOrDark(item.color.substr(1,6))}`"
            class="chip"
          >{{ item.color }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="tw-flex tw-items-end tw-justify-end">
          <router-link :to="`/roles/${item.uuid}`" class="mr-2" v-can="'show_role'">
            <v-icon small title="Show" class="hover:tw-text-blue-500">mdi-eye</v-icon>
          </router-link>
          <router-link :to="`/roles/${item.uuid}/edit`" class="mr-2" v-can="'update_role'">
            <v-icon small title="Edit" class="hover:tw-text-green-500">mdi-pencil</v-icon>
          </router-link>
          <div v-can="'delete_role'">
            <v-icon small title="Delete" @click="toggleDialog(datas.indexOf(item))" class="hover:tw-text-red-500">mdi-delete</v-icon>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  const axios = require('axios');

  export default {
    name: 'Roles',

    data: () => ({
      datas:[],
      headers : [
        { text: 'No', align: 'start', value: 'no' },
        { text: 'Name'            , value: 'name' },
        { text: 'Displaying Name' , value: 'display_name' },
        { text: 'Scope'        , value: 'scope' },
        { text: 'Permissions'     , value: 'permissions' },
        { text: 'Color'           , value: 'color', align: 'center', sortable: false },
        { text: 'Actions'         , value: 'actions', align: 'right', sortable: false },
      ],
      tableSearch: '',
      loading: true,
      displayingPermissionsPerRow: 9,
      expandedPermissions: [],
      dialog: false,
      deletingIndex: -1,
    }),

    created () {
      axios.get('http://localhost:8000/api/v1/roles')
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
        let deletingDataId = this.datas[this.deletingIndex].uuid;

        axios.delete('http://localhost:8000/api/v1/roles/' + deletingDataId)
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
  }
</script>
