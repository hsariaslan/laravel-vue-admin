<template>
  <v-list
    dense
    nav
    class="tw-py-0"
  >
    <v-list-item
      v-for="item in items"
      :key="item.title"
      :to="item.link"
      link
      class="menu-links tw-text-trueGray-550 tw-my-2 tw-h-auto"
    >
      <v-list-item-icon class="tw-bg-sideBar-800 tw-h-auto tw-p-1.5 tw-rounded-md tw-my-1 tw-mr-2">
        <v-icon class="menu-icons tw-text-trueGray-550 tw-font-extralight">{{ item.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title class="menu-texts tw-text-sm tw-transition-all">{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  export default {
    name: 'Menu',
    props: ['items']
  }
</script>

<style scoped>
.v-list-item--active .menu-texts, .v-list-item--active .menu-icons {
  color: #EF4444 !important;
}
</style>