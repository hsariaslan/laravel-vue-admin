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
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Permission Display Name*"
                  type="text"
                  v-model="permission.display_name"
                  :error-messages="display_nameErrors"
                  @input="input('display_name')"
                  @blur="input('display_name')">
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Permission Name*"
                  type="text"
                  disabled
                  hint="Slugified display name"
                  persistent-hint
                  v-model="permission.name"
                  :error-messages="nameErrors"
                  @input="input('name')"
                  @blur="input('name')">
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="12" md="4">
                <v-select
                  label="Action*"
                  v-model="permission.action"
                  :items="actions"
                  :error-messages="actionErrors"
                  @input="input('action')"
                  @blur="input('action')"
                  item-text="name"
                  item-value="uuid">
                </v-select>
              </v-col>
              
              <v-col cols="12" sm="12" md="4">
                <v-select
                  label="Category*"
                  v-model="permission.category"
                  :items="categories"
                  :error-messages="categoryErrors"
                  @input="input('category')"
                  @blur="input('category')"
                  item-text="name"
                  item-value="uuid">
                </v-select>
              </v-col>

              <v-col cols="12" sm="12" md="4">
                <v-select
                  label="Group*"
                  v-model="permission.group"
                  :items="groups"
                  :error-messages="groupErrors"
                  @input="input('group')"
                  @blur="input('group')">
                </v-select>
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
            <v-col cols="12" sm="9" md="6" lg="3" class="tw-mx-auto">
              <v-btn
                type="submit"
                :loading="loading"
                :disabled="disabled"
                color="primary"
                class="tw-w-full">
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
          transition="scale-transition">
          Permission created.
          <router-link :to="`/permissions/${permission.uuid}`" class="success-links">Show the permission</router-link> |
          <router-link to="/permissions" class="success-links">Return to permissions list</router-link>
        </v-alert>

        <v-alert
          dense
          type="error"
          class="tw-mx-4 tw-mt-3"
          v-if="result === 0"
          dismissible
          transition="scale-transition">
          <div
            v-for="(error, id) in errors.errors"
            :key="id">
            {{ error[0] }}
          </div>
        </v-alert>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import { required, minLength, maxLength, } from 'vuelidate/lib/validators';
  import axios from 'axios';

  export default {
    data: () => ({
      permission: {
        uuid          : null,
        name          : '',
        display_name  : '',
        action        : '',
        category      : '',
        group         : 'cms',
      },
      actions: [],
      categories: [],
      groups: ['cms', 'product'],
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
        action:       { required, },
        category:     { required, },
        group:        { required, minLength: minLength(1) , maxLength: maxLength(10), },
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

      axios.get('http://localhost:8000/api/v1/permission-actions')
      .then((response) => {
        this.actions = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get('http://localhost:8000/api/v1/permission-categories')
      .then((response) => {
        this.categories = response.data.data;
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
          axios.post('http://localhost:8000/api/v1/permissions', this.permission)
          .then((response) => {
            this.permission = {
              uuid          : response.data.data.uuid,
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
          case 'display_name':
            this.$v.permission.display_name.$touch();
            this.makeSlug();
          break;
          case 'name': this.$v.permission.name.$touch(); break;
          case 'action': this.$v.permission.action.$touch(); break;
          case 'category': this.$v.permission.category.$touch(); break;
          case 'group': this.$v.permission.group.$touch(); break;
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

      actionErrors () {
        const errors = [];
        if (!this.$v.permission.action.$dirty) return errors;
        !this.$v.permission.action.required && errors.push('Action is required.');
        return errors;
      },

      categoryErrors () {
        const errors = [];
        if (!this.$v.permission.category.$dirty) return errors;
        !this.$v.permission.category.required && errors.push('Category is required.');
        return errors;
      },

      groupErrors () {
        const errors = [];
        if (!this.$v.permission.group.$dirty) return errors;
        !this.$v.permission.group.minLength && errors.push('Group must be minimum 1 characters long');
        !this.$v.permission.group.maxLength && errors.push('Group must be at most 10 characters long');
        !this.$v.permission.group.required && errors.push('Group is required.');
        return errors;
      },
    },
  }
</script>