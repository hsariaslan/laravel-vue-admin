<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="datas"
      :search="tableSearch"
      sort-by="id"
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
            to="/permissions/new"
            v-can="'create_role'"
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
          
          <v-dialog v-model="dialog" max-width="600px" persistent>
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this permission?</v-card-title>
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
      <template v-slot:item.actions="{ item }">
        <div class="tw-flex tw-items-end tw-justify-end">
          <router-link :to="`/permissions/${item.id}`" class="mr-2">
            <v-icon small title="Show" class="hover:tw-text-blue-500">mdi-eye</v-icon>
          </router-link>
          <router-link :to="`/permissions/${item.id}/edit`" class="mr-2">
            <v-icon small title="Edit" class="hover:tw-text-green-500">mdi-pencil</v-icon>
          </router-link>
          <v-icon small @click="toggleDialog(datas.indexOf(item))">mdi-delete</v-icon>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  const axios = require('axios');

  export default {
    name: 'Permissions',

    data: () => ({
      datas:[],
      headers : [
        { text: 'ID', align: 'start', value: 'id' },
        { text: 'Name'            , value: 'name' },
        { text: 'Displaying Name' , value: 'display_name' },
        { text: 'Actions'         , value: 'actions', align: 'right', sortable: false },
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
        if(error.response.status === 401) {
          this.$router.push('Logout');
        }
        console.log(error);
      });
    },

    methods: {
      deleteData() {
        let deletingDataId = this.datas[this.deletingIndex].id;

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
  }
</script>