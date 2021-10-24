<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="datas"
      :search="tableSearch"
      sort-by="no"
      dense
      group-by="category.name"
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
            to="/permissions/new"
            v-can="'create_permission'"
          >
            New Permission
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="tableSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          
          <v-dialog v-model="dialog" max-width="700px" persistent>
            <v-card>
              <v-card-title>
                <span class="text-h5">Are you sure you want to delete this permission?</span>
                <span class="tw-text-red-600">
                  <v-icon class="tw-text-red-600 tw--mt-1">mdi-alert</v-icon>
                  Warning: This is not recommended since can break a feature!
                </span>
              </v-card-title>
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
      
      <template v-slot:item.action="{ item }">
        {{ item.action.name }}
      </template>
      
      <template v-slot:item.category="{ item }">
        {{ item.category.name }}
      </template>

      <template v-slot:item.actions="{ item }">
        <div v-if="loggedUser.roles[0].includes('admin')" class="tw-flex tw-items-end tw-justify-end">
          <div class="tw-float-left">
            <router-link :to="`/permissions/${item.uuid}`">
              <v-icon small title="Show" class="hover:tw-text-blue-500">mdi-eye</v-icon>
            </router-link>
          </div>
          <div class="tw-float-left tw-ml-2">
            <router-link :to="`/permissions/${item.uuid}/edit`">
              <v-icon small title="Edit" class="hover:tw-text-green-500">mdi-pencil</v-icon>
            </router-link>
          </div>
          <div class="tw-float-left tw-ml-2">
            <v-icon small title="Delete" @click="toggleDialog(datas.indexOf(item))" class="hover:tw-text-red-500">mdi-delete</v-icon>
          </div>
        </div>
        <div v-else class="tw-flex tw-items-end tw-justify-end">
          <div class="tw-float-left" v-can="'show_permission'">
            <router-link :to="`/permissions/${item.uuid}`">
              <v-icon small title="Show" class="hover:tw-text-blue-500">mdi-eye</v-icon>
            </router-link>
          </div>
          <div class="tw-float-left tw-ml-2" v-can="'update_permission'" v-if="loggedUser.permissions.includes(item.name)">
            <router-link :to="`/permissions/${item.uuid}/edit`">
              <v-icon small title="Edit" class="hover:tw-text-green-500">mdi-pencil</v-icon>
            </router-link>
          </div>
          <div class="tw-float-left tw-ml-2" v-can="'delete_permission'" v-if="loggedUser.permissions.includes(item.name)">
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
    name: 'Permissions',

    data: () => ({
      datas:[],
      headers : [
        { text: 'No'                , value: 'no', },
        { text: 'Name'              , value: 'name', },
        { text: 'Displaying Name'   , value: 'display_name', },
        { text: 'Action'            , value: 'action' },
        { text: 'Category'          , value: 'category' },
        { text: 'Group'             , value: 'group' },
        { text: 'Actions'           , value: 'actions', align: 'right', sortable: false, },
      ],
      tableSearch: '',
      loading: true,
      dialog: false,
      deletingIndex: -1,
    }),

    created () {
      axios.get('http://localhost:8000/api/v1/permissions')
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

        axios.delete('http://localhost:8000/api/v1/permissions/' + deletingDataId)
        .then(() => {
          this.datas.splice(this.deletingIndex, 1);
          this.toggleDialog();
        })
        .catch((error) => {
          console.log(error);
        });
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