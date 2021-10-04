<template>
  <v-card class="elevation-12">
    <v-form>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Forget Password</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          name="login"
          label="E-mail"
          type="text"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="d-sm-flex justify-space-between">
        <router-link to="/login" class="float-left mt-3 ml-3 text-body-2">Back to login form</router-link>
        <v-btn color="primary" to="/" class="mr-2 mt-3 mb-2">Send E-mail</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
   name: 'Login'
};
</script>

<style></style>
