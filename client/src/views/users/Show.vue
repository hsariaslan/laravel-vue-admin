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
        <span class="text-h5 tw-ml-2">User: {{ user.name + ' ' + user.surname }}</span>
      </v-card-title>
      <v-card-text>
        <div class="tw-bg-red-100 tw-pt-6 tw-pb-4">
          <v-img src="@/assets/img/profile-big.jpeg" class="tw-w-52 tw-max-h-52 tw-rounded-full tw-mx-auto tw-border-5 tw-border-red-500"></v-img>
          <div class="tw-flex tw-flex-col tw-items-center tw-mt-6 tw-gap-1">
          <span class="tw-text-xl tw-font-bold">{{ user.name + ' ' + user.surname }}</span>
          <span class="tw-text-red-500 tw-font-semibold">{{ user.roles.name }}</span>
          <span>@{{ user.username }}</span>
          <span>{{ user.email }}</span>
          </div>
        </div>
        <div class="tw-bg-red-50 tw-p-6">
          <div class="tw-flex tw-justify-between tw-text-center">
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
  import Localbase from 'localbase'
  let db = new Localbase('db')
  db.config.debug = false

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
      const userIdFromPath = parseInt(this.$route.fullPath.split('/')[2])
      this.user.id = userIdFromPath
      this.$store.dispatch('table', 'users')
      db.collection('users').doc({id: userIdFromPath}).get().then(user => {
        this.user = user
        // console.log(this.user)
      }).then(() => {
        db.collection('roles').doc({id: this.user.roles}).get().then(roles => {
          this.user.roles = roles
        })
      })
    },
  }
</script>
