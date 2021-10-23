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
          <span class="text-h5">New Role</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="4"
              >
                <v-text-field
                  label="Role Display Name*"
                  type="text"
                  v-model="role.display_name"
                  :error-messages="display_nameErrors"
                  @input="input('display_name')"
                  @blur="input('display_name')"
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
              >
                <v-text-field
                  label="Role Name*"
                  type="text"
                  disabled
                  hint="Slugified display name"
                  persistent-hint
                  v-model="role.name"
                  :error-messages="nameErrors"
                  @input="input('name')"
                  @blur="input('name')"
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="4"
              >
                <v-text-field
                  label="Scope*"
                  type="number"
                  hint="Scope means how the relevant role has the permissions extensively. Lower number means higher scope. Lower scope roles can't execute the actions of higher scope roles."
                  persistent-hint
                  v-model="role.scope"
                  :error-messages="scopeErrors"
                  @input="input('scope')"
                  @blur="input('scope')"
                  @keypress="isNumber($event)"
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-select
                  label="Permissions*"
                  multiple
                  chips
                  persistent-hint
                  v-model="role.permissions"
                  :items="permissions"
                  :error-messages="permissionsErrors"
                  @input="input('permissions')"
                  @blur="input('permissions')"
                  item-text="display_name"
                  item-value="uuid"
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon :color="role.permissions.length > 0 ? 'indigo darken-4' : ''">
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

              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <span>Color</span>
                <v-color-picker
                  v-model="role.color"
                  :error-messages="colorErrors"
                  @input="input('color')"
                  @blur="input('color')"
                  dot-size="42"
                  hide-canvas
                  hide-inputs
                  hide-mode-switch
                  hide-sliders
                  show-swatches
                  swatches-max-height="500"
                  width="full"
                ></v-color-picker>
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
          Role created. <router-link :to="`/roles/${role.uuid}`" class="success-links">Show the role</router-link> | <router-link to="/roles" class="success-links">Return to roles list</router-link>
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
  import { required, minLength, maxLength, numeric, between, } from 'vuelidate/lib/validators';
  import axios from 'axios';

  export default {
    data: () => ({
      role: {
        uuid            : null,
        name          : '',
        display_name  : '',
        scope         : 100,
        color         : '',
        permissions   : [],
      },
      permissions: [],
      disabled: true,
      loading: false,
      result: false,
      errors: null,
    }),
    
    mixins: [validationMixin],
    validations: {
      role: {
        name:         { required, minLength: minLength(3) , maxLength: maxLength(20), },
        display_name: { required, minLength: minLength(3) , maxLength: maxLength(20), },
        scope:        { required, numeric, between: between(1, 255), },
        color:        { required, minLength: minLength(9) , maxLength: maxLength(9), },
        permissions:  { required, },
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
          this.role.color = this.role.color.substr(1,8);
          axios.post('http://localhost:8000/api/v1/roles', this.role)
          .then((response) => {
            this.role = {
              uuid          : response.data.data.uuid,
              name          : '',
              display_name  : '',
              color         : '',
              permissions   : [],
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
            this.$v.role.display_name.$touch();
            this.makeSlug();
          break;
          case 'name'         : this.$v.role.name.$touch(); break;
          case 'scope'        : this.$v.role.scope.$touch(); break;
          case 'color'        : this.$v.role.color.$touch(); break;
          case 'permissions'  : this.$v.role.permissions.$touch(); break;
        }
        this.disabled = this.$v.$invalid;
      },

      makeSlug() {
        this.role.name = this.$helpers.stringToSlug(this.role.display_name);
      },

      isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          evt.preventDefault();
        } else {
          return true;
        }
      },

      toggle () {
        this.$nextTick(() => {
          if (this.allPermissions) {
            this.role.permissions = "";
          } else {
            this.role.permissions = this.permissions.slice();
            this.role.permissions = this.permissions.map(({ uuid }) => uuid);
          }
        })
      },
    },

    computed: {
      nameErrors () {
        const errors = [];
        if (!this.$v.role.name.$dirty) return errors;
        !this.$v.role.name.minLength && errors.push('Name must be minimum 3 characters long');
        !this.$v.role.name.maxLength && errors.push('Name must be at most 20 characters long');
        !this.$v.role.name.required && errors.push('Name is required.');
        return errors;
      },

      display_nameErrors () {
        const errors = [];
        if (!this.$v.role.display_name.$dirty) return errors;
        !this.$v.role.display_name.minLength && errors.push('Display Name must be minimum 3 characters long');
        !this.$v.role.display_name.maxLength && errors.push('Display Name must be at most 20 characters long');
        !this.$v.role.display_name.required && errors.push('Display Name is required.');
        return errors;
      },

      scopeErrors () {
        const errors = [];
        if (!this.$v.role.scope.$dirty) return errors;
        !this.$v.role.scope.numeric && errors.push('Scope must be numeric.');
        !this.$v.role.scope.between && errors.push('Scope value must between 1 and 255.');
        !this.$v.role.scope.required && errors.push('Scope is required.');
        return errors;
      },

      colorErrors () {
        const errors = [];
        if (!this.$v.role.color.$dirty) return errors;
        !this.$v.role.color.minLength && errors.push('Color must be 9 characters long');
        !this.$v.role.color.maxLength && errors.push('Color must be 9 characters long');
        !this.$v.role.color.required && errors.push('Color is required.');
        return errors;
      },

      permissionsErrors () {
        const errors = [];
        if (!this.$v.role.permissions.$dirty) return errors;
        !this.$v.role.permissions.required && errors.push('Permission is required.');
        return errors;
      },

      allPermissions () {
        return this.role.permissions.length === this.permissions.length;
      },

      somePermissions () {
        return this.role.permissions.length > 0 && !this.allPermissions;
      },
      
      selectAllIcon () {
        if (this.allPermissions) return 'mdi-close-box';
        if (this.somePermissions) return 'mdi-minus-box';
        return 'mdi-checkbox-blank-outline';
      },
    },
  }
</script>