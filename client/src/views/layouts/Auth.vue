<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    created() {
      if(this['auth/login'] !== false) {
        //this.$router.push("/")
      }
    }
  };
</script>
