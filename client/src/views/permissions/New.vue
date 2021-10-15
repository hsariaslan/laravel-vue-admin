<template>
  <div>
    <div class="tw-flex tw-gap-x-2">
      <div @click="$router.back()" class="back tw-cursor-pointer tw-flex tw-items-center">
        <v-icon>mdi-chevron-left</v-icon>
        <span class="tw-text-base tw--ml-1">Back</span>
      </div>
    </div>
    <v-card>
      <v-form @submit.prevent="save">
        <v-card-title>
          <span class="text-h5">New Permission</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  label="Permission Display Name*"
                  type="text"
                  v-model="permission.display_name"
                  :error-messages="display_nameErrors"
                  @input="input('display_name')"
                  @blur="input('display_name')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  label="Permission Name*"
                  type="text"
                  disabled
                  hint="Slugified display name"
                  persistent-hint
                  v-model="permission.name"
                  :error-messages="nameErrors"
                  @input="input('name')"
                  @blur="input('name')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <i class="tw-text-xs tw-text-red-500">* Required</i>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col
              cols="12"
              sm="9"
              md="6"
              lg="3"
              class="tw-mx-auto"
            >
              <v-btn
                type="submit"
                :loading="loading"
                :disabled="disabled"
                color="primary"
                class="tw-w-full"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
        
        <v-alert
          dense
          type="success"
          class="tw-mx-4 tw-mt-3"
          v-if="result === 1"
          dismissible
          transition="scale-transition"
        >
          Permission created. <router-link :to="`/permissions/${permission.id}`" class="success-links">Show the permission</router-link> | <router-link to="/permissions" class="success-links">Return to permissions list</router-link>
        </v-alert>

        <v-alert
          dense
          type="error"
          class="tw-mx-4 tw-mt-3"
          v-if="result === 0"
          dismissible
          transition="scale-transition"
        >
          <div
            v-for="(error, id) in errors.errors"
            :key="id"
          >
            {{ error[0] }}
          </div>
        </v-alert>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import { required, minLength, maxLength } from 'vuelidate/lib/validators';
  const axios = require('axios');

  export default {
    data: () => ({
      permission: {
        id            : null,
        name          : '',
        display_name  : '',
      },
      disabled: true,
      loading: false,
      result: false,
      errors: null,
    }),
    
    mixins: [validationMixin],
    validations: {
      permission: {
        name:         { required, minLength: minLength(3) , maxLength: maxLength(20), },
        display_name: { required, minLength: minLength(3) , maxLength: maxLength(20), },
      }
    },

    created() {
      axios.get('http://localhost:8000/api/v1/permissions')
      .then((response) => {
        this.permissions = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },

    methods: {
      save () {
        this.disabled = true;
        this.loading = true;
        this.result = false;
        this.errors = [];
        this.$v.$touch();

        if (!this.$v.$invalid) {
          axios.post('http://localhost:8000/api/v1/permissions/create', this.permission)
          .then((response) => {
            this.permission = {
              id          : response.data.data.id,
              name          : '',
              display_name  : '',
            };
            this.loading = false;
            this.result = 1;
            this.$v.$reset();
          })
          .catch((error) => {
            this.disabled = false;
            this.loading = false;
            this.result = 0;
            this.errors = {
              status: error.response.status,
              message: error.response.data.message,
              errors: error.response.data.errors,
            };
          });
        }
      },

      input(input) {
        switch (input) {
          case 'display_name' :
            this.$v.permission.display_name.$touch();
            this.makeSlug();
          break;
          case 'name'         : this.$v.permission.name.$touch(); break;
        }
        this.disabled = this.$v.$invalid;
      },

      makeSlug() {
        this.permission.name = this.$helpers.stringToSlug(this.permission.display_name);
      },
    },

    computed: {
      nameErrors () {
        const errors = [];
        if (!this.$v.permission.name.$dirty) return errors;
        !this.$v.permission.name.minLength && errors.push('Name must be minimum 3 characters long');
        !this.$v.permission.name.maxLength && errors.push('Name must be at most 20 characters long');
        !this.$v.permission.name.required && errors.push('Name is required.');
        return errors;
      },

      display_nameErrors () {
        const errors = [];
        if (!this.$v.permission.display_name.$dirty) return errors;
        !this.$v.permission.display_name.minLength && errors.push('Display Name must be minimum 3 characters long');
        !this.$v.permission.display_name.maxLength && errors.push('Display Name must be at most 20 characters long');
        !this.$v.permission.display_name.required && errors.push('Display Name is required.');
        return errors;
      },
    },
  }
</script>