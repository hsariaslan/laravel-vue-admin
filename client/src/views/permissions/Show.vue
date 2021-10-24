<template>
  <div>
    <div class="tw-flex tw-gap-x-2">
      <div @click="$router.back()" class="back tw-cursor-pointer tw-flex tw-items-center">
        <v-icon>mdi-chevron-left</v-icon>
        <span class="tw-text-base tw--ml-1">Back</span>
      </div>
      <div v-if="loggedUser.roles[0].includes('admin')" class="tw-flex tw-gap-x-2">
        <router-link :to="`/permissions/${permission.uuid}/edit`" class="edit tw-flex tw-items-center">
          <v-icon small>mdi-pencil</v-icon>
          <span class="tw-text-base">Edit</span>
        </router-link>
        <div class="delete tw-flex tw-items-center tw-cursor-pointer" @click="toggleDialog()">
          <v-icon small title="Delete" class="hover:tw-text-red-500">mdi-delete</v-icon>
          <span class="tw-text-base">Delete</span>
        </div>
      </div>
      <div v-else>
        <div v-can="'update_permission'" v-if="loggedUser.permissions.includes(permission.name)">
          <router-link :to="`/permissions/${permission.uuid}/edit`" class="edit tw-flex tw-items-center">
            <v-icon small>mdi-pencil</v-icon>
            <span class="tw-text-base">Edit</span>
          </router-link>
        </div>
        <div v-can="'delete_permission'" v-if="loggedUser.permissions.includes(permission.name)">
          <div class="delete tw-flex tw-items-center tw-cursor-pointer" @click="toggleDialog()">
            <v-icon small title="Delete" class="hover:tw-text-red-500">mdi-delete</v-icon>
            <span class="tw-text-base">Delete</span>
          </div>
        </div>
      </div>
    </div>
    <v-card class="elevation-1 tw-mt-2">
      <v-card-title class="tw-flex tw-items-center tw-gap-3">
        <span class="text-h5 tw-ml-2">Permission: {{ permission.name }}</span>
      </v-card-title>
      <v-card-text class="tw-grid tw-grid-cols-12">
        <div class="tw-bg-red-100 tw-p-3 tw-col-span-3">
          <div class="tw-flex tw-flex-col tw-gap-1">
            <span class="tw-text-base"><b>Name:</b> {{ permission.name }}</span>
            <span class="tw-text-base"><b>Display Name:</b> {{ permission.display_name }}</span>
            <span class="tw-text-base"><b>Action:</b> {{ permission.action.name }}</span>
            <span class="tw-text-base"><b>Category:</b> {{ permission.category.name }}</span>
            <span class="tw-text-base"><b>Group:</b> {{ permission.group }}</span>
          </div>
        </div>
        <div class="tw-bg-red-50 tw-p-3 tw-col-span-9">
          <span class="tw-text-sm tw-mt-2 tw-font-bold">Users has this permission</span>
          <!-- <div class="tw-my-2">
            <span
              v-for="(permission, idx) in user.permissions"
              :key="idx"
              :style="'background-color:'+permission.color"
              class="chip"
            >{{ permission.display_name }}</span>
          </div> -->
        </div>
      </v-card-text>
    </v-card>

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
            <v-btn color="blue darken-1" text @click="toggleDialog()">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteData">
              OK
            </v-btn>
          </template>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import axios from 'axios';

  export default {
    data: () => ({
      permission: {
        uuid          : null,
        name          : '',
        display_name  : '',
        action        : '',
        category      : '',
        group         : '',
      },
      dialog: false,
    }),

    created() {
      const idFromPath = this.$route.fullPath.split('/')[2];
      
      axios.get('http://localhost:8000/api/v1/permissions/' + idFromPath)
      .then((response) => {
        this.permission = response.data.data;
        this.$store.dispatch('breadcrumbTitle', this.permission.display_name);
      })
      .catch((error) => {
        console.log(error);
      });
    },

    methods: {
      deleteData() {
        let deletingDataId = this.permission.uuid;

        axios.delete('http://localhost:8000/api/v1/permissions/' + deletingDataId)
        .then(() => {
          this.$router.push('/permissions');
        })
        .catch((error) => {
          console.log(error);
        });
      },

      toggleDialog() {
        this.dialog = !this.dialog;
      },
    },

    computed: {
      ...mapGetters({loggedUser: 'auth/login'})
    },
  }
</script>
