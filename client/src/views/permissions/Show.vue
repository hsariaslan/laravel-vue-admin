<template>
  <div>
    <div class="tw-flex tw-gap-x-2">
      <div @click="$router.back()" class="back tw-cursor-pointer tw-flex tw-items-center">
        <v-icon>mdi-chevron-left</v-icon>
        <span class="tw-text-base tw--ml-1">Back</span>
      </div>
      <router-link :to="`/permissions/${permission.id}/edit`" class="edit tw-flex tw-items-center">
        <v-icon small>mdi-pencil</v-icon>
        <span class="tw-text-base">Edit</span>
      </router-link>
    </div>
    <v-card class="elevation-1 tw-mt-2">
      <v-card-title class="tw-flex tw-items-center tw-gap-3">
        <span class="text-h5 tw-ml-2">Permission: {{ permission.display_name }}</span>
      </v-card-title>
      <v-card-text class="tw-grid tw-grid-cols-12">
        <div class="tw-bg-red-100 tw-p-3 tw-col-span-3">
          <div class="tw-flex tw-flex-col tw-items-center tw-gap-1">
            <span class="tw-text-xl tw-font-bold">{{ permission.display_name + ' (' + permission.name + ')' }}</span>
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
  </div>
</template>

<script>
  const axios = require('axios');

  export default {
    data: () => ({
      permission: {
        id            : null,
        name          : '',
        display_name  : '',
      },
    }),

    created() {
      const idFromPath = parseInt(this.$route.fullPath.split('/')[2]);
      
      axios.get('http://localhost:8000/api/v1/permissions/' + idFromPath)
      .then((response) => {
        this.permission = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
  }
</script>
