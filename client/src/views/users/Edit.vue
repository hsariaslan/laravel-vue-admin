<template>
  <div>
    <div class="tw-flex tw-gap-x-2">
      <div @click="$router.back()" class="back tw-cursor-pointer tw-flex tw-items-center">
        <v-icon>mdi-chevron-left</v-icon>
        <span class="tw-text-base tw--ml-1">Back</span>
      </div>
    </div>
    <v-card class="elevation-1 tw-mt-2">
      <v-form @submit.prevent="save">
        <v-card-title class="tw-flex tw-items-center tw-gap-3">
          <span class="text-h5 tw-ml-2">Edit User: {{ usernameTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  label="Email*"
                  type="email"
                  v-model="user.email"
                  :error-messages="emailErrors"
                  @input="input('email')"
                  @blur="input('email')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  label="Username*"
                  v-model="user.username"
                  :error-messages="usernameErrors"
                  @input="input('username')"
                  @blur="input('username')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  label="New Password"
                  type="password"
                  hint="Leave it empty if you don't want to change password"
                  persistent-hint
                  v-model="user.password"
                  :error-messages="passwordErrors"
                  @input="input('password')"
                  @blur="input('password')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  label="Confirm Password"
                  type="password"
                  v-model="user.password_confirmation"
                  :error-messages="password_confirmationErrors"
                  @input="input('password_confirmation')"
                  @blur="input('password_confirmation')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  label="Name*"
                  v-model="user.name"
                  :error-messages="nameErrors"
                  @input="input('name')"
                  @blur="input('name')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  label="Surname*"
                  v-model="user.surname"
                  :error-messages="surnameErrors"
                  @input="input('surname')"
                  @blur="input('surname')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-select
                  label="Role*"
                  multiple
                  persistent-hint
                  v-model="user.roles"
                  :items="roles"
                  :error-messages="rolesErrors"
                  @input="input('roles')"
                  @blur="input('roles')"
                  item-text="display_name"
                  item-value="id"
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
              >
                <v-select
                  label="Direct Permissions"
                  multiple
                  chips
                  hint="Select if you want to define additional permissions for this user aside from the selected role(s)"
                  persistent-hint
                  v-model="user.permissions"
                  :items="permissions"
                  item-text="display_name"
                  item-value="id"
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @click="toggle"
                    >
                      <v-list-item-action>
                        <v-icon :color="user.permissions.length > 0 ? 'indigo darken-4' : ''">
                          {{ selectAllIcon }}
                        </v-icon>
                      </v-list-item-action>

                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>

                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
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
          User updated. <router-link :to="`/users/${user.id}`" class="success-links">Show the user</router-link> | <router-link to="/users" class="success-links">Return to users list</router-link>
        </v-alert>

        <v-alert
          dense
          type="error"
          class="tw-mx-4 tw-mt-3"
          v-if="result === 0"
          dismissible
          transition="scale-transition"
        >
          <div v-if="errors.status === 500">{{ errors.message }}</div>
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
  import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators';
  const axios = require('axios');

  export default {
    data: () => ({
      user: {
        id                    : null,
        email                 : '',
        username              : '',
        password              : '',
        password_confirmation : '',
        name                  : '',
        surname               : '',
        roles                 : [],
        permissions           : [],
        rememberMe            : false,
        all_permissions       : [],
      },
      usernameTitle: '',
      roles: [],
      permissions: [],
      disabled: false,
      loading: false,
      result: false,
      errors: null,
    }),
    
    mixins: [validationMixin],
    validations: {
      user: {
        email:                  { required, minLength: minLength(6) , maxLength: maxLength(50), email, },
        username:               { required, minLength: minLength(5) , maxLength: maxLength(20), },
        password:               { minLength: minLength(6) , maxLength: maxLength(20), },
        password_confirmation:  { sameAsPassword: sameAs('password') },
        name:                   { required, minLength: minLength(3) , maxLength: maxLength(20), },
        surname:                { required, minLength: minLength(3) , maxLength: maxLength(20), },
        roles:                  { required, },
      }
    },

    created() {
      const userIdFromPath = parseInt(this.$route.fullPath.split('/')[2]);
      this.user.id = userIdFromPath;
      
      axios.get('http://localhost:8000/api/v1/users/' + userIdFromPath)
      .then((response) => {
        this.user = response.data.data;
        this.usernameTitle = this.user.username;
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get('http://localhost:8000/api/v1/roles')
      .then((response) => {
        this.roles = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });

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
          const tempRoles = this.user.roles;
          const tempPermissions = this.user.permissions;
          
          if(this.$helpers.isArrayOfObjects(this.user.roles)) {
            let roles = [];

            this.user.roles.forEach(role => {
              roles.push(role.id);
            });

            this.user.roles = roles;
          }
          
          if(this.$helpers.isArrayOfObjects(this.user.permissions)) {
            let permissions = [];

            this.user.permissions.forEach(permission => {
              permissions.push(permission.id);
            });

            this.user.permissions = permissions;
          }

          if(this.user.password === '') {
            this.user = {
              id          : this.user.id,
              name        : this.user.name,
              surname     : this.user.surname,
              username    : this.user.username,
              email       : this.user.email,
              roles       : this.user.roles,
              permissions : this.user.permissions,
              rememberMe  : this.user.rememberMe,
            }
          }

          axios.patch('http://localhost:8000/api/v1/users/' + this.user.id, this.user)
          .then(() => {
            this.user.roles = tempRoles;
            this.user.permissions = tempPermissions;
            this.loading = false;
            this.result = 1;
            this.$v.$reset();
          })
          .catch((error) => {
            this.errors = {
              status: error.response.status,
              message: error.response.data.message,
              errors: error.response.data.errors,
            };
            this.disabled = false;
            this.loading = false;
            this.result = 0;
          });
        }
      },

      input(input) {
        switch (input) {
          case 'email'                  : this.$v.user.email.$touch(); break;
          case 'username'               : this.$v.user.username.$touch(); break;
          case 'password'               : this.$v.user.password.$touch(); break;
          case 'password_confirmation'  : this.$v.user.password_confirmation.$touch(); break;
          case 'name'                   : this.$v.user.name.$touch(); break;
          case 'surname'                : this.$v.user.surname.$touch(); break;
          case 'roles'                  : this.$v.user.roles.$touch(); break;
        }
        this.disabled = this.$v.$invalid;
      },

      toggle () {
        this.$nextTick(() => {
          if (this.allPermissions) {
            this.user.permissions = "";
          } else {
            this.user.permissions = this.permissions.slice();
            this.user.permissions = this.permissions.map(({ id }) => id);
          }
        });
      },
    },

    computed: {
      emailErrors () {
        const errors = [];
        if (!this.$v.user.email.$dirty) return errors;
        !this.$v.user.email.minLength && errors.push('Email must be minimum 6 characters long');
        !this.$v.user.email.maxLength && errors.push('Email must be at most 50 characters long');
        !this.$v.user.email.required && errors.push('Email is required.');
        !this.$v.user.email.email && errors.push('Email must be a valid email.');
        return errors;
      },

      usernameErrors () {
        const errors = [];
        if (!this.$v.user.username.$dirty) return errors;
        !this.$v.user.username.minLength && errors.push('Username must be minimum 5 characters long');
        !this.$v.user.username.maxLength && errors.push('Username must be at most 20 characters long');
        !this.$v.user.username.required && errors.push('Username is required.');
        return errors;
      },

      passwordErrors () {
        const errors = [];
        if (!this.$v.user.password.$dirty) return errors;
        !this.$v.user.password.minLength && errors.push('Password must be minimum 6 characters long');
        !this.$v.user.password.maxLength && errors.push('Password must be at most 20 characters long');
        return errors;
      },

      password_confirmationErrors () {
        const errors = [];
        if (!this.$v.user.password_confirmation.$dirty) return errors;
        !this.$v.user.password_confirmation.sameAsPassword && errors.push('Passwords must be identical');
        return errors;
      },

      nameErrors () {
        const errors = [];
        if (!this.$v.user.name.$dirty) return errors;
        !this.$v.user.name.minLength && errors.push('Name must be minimum 3 characters long');
        !this.$v.user.name.maxLength && errors.push('Name must be at most 20 characters long');
        !this.$v.user.name.required && errors.push('Name is required.');
        return errors;
      },

      surnameErrors () {
        const errors = [];
        if (!this.$v.user.surname.$dirty) return errors;
        !this.$v.user.surname.minLength && errors.push('Surname must be minimum 3 characters long');
        !this.$v.user.surname.maxLength && errors.push('Surname must be at most 20 characters long');
        !this.$v.user.surname.required && errors.push('Surname is required.');
        return errors;
      },

      rolesErrors () {
        const errors = [];
        if (!this.$v.user.roles.$dirty) return errors;
        !this.$v.user.roles.required && errors.push('Role is required.');
        return errors;
      },

      allPermissions () {
        return this.user.permissions.length === this.permissions.length
      },

      somePermissions () {
        return this.user.permissions.length > 0 && !this.allPermissions
      },

      selectAllIcon () {
        if (this.allPermissions) return 'mdi-close-box'
        if (this.somePermissions) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },
  }
</script>

