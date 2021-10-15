<template>
  <div>
    <div class="tw-flex tw-gap-x-2">
      <div @click="$router.back()" class="back tw-cursor-pointer tw-flex tw-items-center">
        <v-icon>mdi-chevron-left</v-icon>
        <span class="tw-text-base tw--ml-1">Back</span>
      </div>
      <router-link :to="`/users/${user.id}/edit`" class="edit tw-flex tw-items-center">
        <v-icon small>mdi-pencil</v-icon>
        <span class="tw-text-base">Edit</span>
      </router-link>
    </div>
    <v-card class="elevation-1 tw-mt-2">
      <v-card-title class="tw-flex tw-items-center tw-gap-3">
        <span class="text-h5 tw-ml-2">User: {{ user.username }}</span>
      </v-card-title>
      <v-card-text class="tw-grid tw-grid-cols-12">
        <div class="tw-bg-red-100 tw-pt-6 tw-pb-4 tw-px-3 tw-col-span-3">
          <v-img src="@/assets/img/profile-big.jpeg" class="tw-w-52 tw-max-h-52 tw-rounded-full tw-mx-auto tw-border-5 tw-border-red-500"></v-img>
          <div class="tw-flex tw-flex-col tw-items-center tw-mt-6 tw-gap-1">
            <span class="tw-text-xl tw-font-bold">{{ user.name + ' ' + user.surname }}</span>
            <div class="tw-my-2">
              <span
                v-for="(role, idx) in user.roles"
                :key="idx"
                :style="`background-color:${role.color}; color:${$helpers.colorLightOrDark(role.color.substr(1,6))}`"
                class="chip"
              >{{ role.display_name }}</span>
            </div>
            <span class="tw-text-lg">@{{ user.username }}</span>
            <span class="tw-text-base">{{ user.email }}</span>
            <span class="tw-text-sm tw-mt-2 tw-font-bold">Permissions</span>
            <div class="tw-flex-wrap">
              <span
                v-for="(permission, idx) in user.all_permissions"
                :key="idx"
                class="chip tw-bg-white tw-text-black tw-block tw-float-left"
              >{{ permission.display_name }}</span>
            </div>
          </div>
        </div>
        <div class="tw-bg-red-50 tw-p-6 tw-col-span-9">
          <div class="tw-flex tw-justify-between tw-text-center tw-items-center tw-h-full">
            <UserRecords
              v-for="record in records"
              :key="record.id"
              :record="record"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
    <DeleteDialog title="user" />
  </div>
</template>

<script>
  import UserRecords from '@/components/UserRecords.vue';
  import DeleteDialog from "@/components/DeleteDialog.vue";
  const axios = require('axios');

  export default {
    components: {
      UserRecords,
      DeleteDialog,
    },

    data: () => ({
      user: {
        id                  : null,
        name                : '',
        surname             : '',
        username            : '',
        email               : '',
        roles               : [],
        permissions         : "",
        rememberMe          : false,
      },
      records: [
        {
          title: 'Posts',
          value: 15,
        },
        {
          title: 'Likes',
          value: 27,
        },
        {
          title: 'Comments',
          value: 6,
        },
      ],
    }),

    created() {
      const idFromPath = parseInt(this.$route.fullPath.split('/')[2]);
      
      axios.get('http://localhost:8000/api/v1/users/' + idFromPath)
      .then((response) => {
        this.user = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
  }
</script>
