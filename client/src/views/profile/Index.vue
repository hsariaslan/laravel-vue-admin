<template>
  <div class="tw-flex tw-justify-between tw-gap-4">
    <div class="tw-w-3/12">
      <div class="tw-bg-red-100 tw-pt-6 tw-pb-4">
        <v-img src="@/assets/img/profile.jpg" class="tw-w-52 tw-max-h-52 tw-rounded-full tw-mx-auto tw-border-5 tw-border-red-500"></v-img>
        <div class="tw-flex tw-flex-col tw-items-center tw-mt-6 tw-gap-1">
          <span class="tw-text-xl tw-font-bold">{{ profile.name + ' ' + profile.surname }}</span>
          <div class="tw-my-2">
            <span
              v-for="(role, idx) in profile.roles"
              :key="idx"
              :style="`background-color:#${role.color}; color:${$helpers.colorLightOrDark(role.color.substr(1,6))}`"
              class="chip tw-text-sm"
            >{{ role.display_name }}</span>
          </div>
          <span class="tw-text-lg">@{{ profile.username }}</span>
          <span class="tw-text-base">{{ profile.email }}</span>
          <span class="tw-text-sm tw-mt-2 tw-font-bold">Permissions</span>
          <div v-if="profile.roles[0].name === 'admin'">
            <i>All permissions</i>
          </div>
          <div class="tw-flex-wrap" v-else>
            <span
              v-for="(permission, idx) in profile.all_permissions"
              :key="idx"
              class="chip tw-bg-white tw-text-black tw-block tw-float-left"
            >{{ permission.display_name }}</span>
          </div>
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
    </div>
    <v-card class="tw-w-9/12">
      <v-form @submit.prevent="save">
        <v-card-title class="tw-flex tw-items-center tw-gap-3">
          <span class="text-h5 tw-ml-2">Edit Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="6"
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
                md="6"
              >
                <v-text-field
                  label="Username*"
                  v-model="user.username"
                  :error-messages="usernameErrors"
                  @input="input('username')"
                  @blur="input('username')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="6"
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
                md="6"
              >
                <v-text-field
                  label="Surname*"
                  v-model="user.surname"
                  :error-messages="surnameErrors"
                  @input="input('surname')"
                  @blur="input('surname')"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="6"
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
                md="6"
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
          Profile updated.
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
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators'
  import UserRecords from '@/components/UserRecords.vue';
  const axios = require('axios');
  
  export default {
    name: 'Profile',
    components: {
      UserRecords,
    },

    data: () => ({
      profile: {
        email                 : '',
        username              : '',
        name                  : '',
        surname               : '',
        roles                 : [{color:'#FFFFFF'}],
        permissions           : [],
        all_permissions       : [],
      },
      user: {
        email                 : '',
        username              : '',
        password              : '',
        password_confirmation : '',
        name                  : '',
        surname               : '',
        rememberMe            : false,
      },
      disabled: false,
      loading: false,
      result: false,
      errors: null,
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

    mixins: [validationMixin],
    validations: {
      user: {
        email:                  { required, minLength: minLength(6) , maxLength: maxLength(50), email, },
        username:               { required, minLength: minLength(5) , maxLength: maxLength(20), },
        password:               { minLength: minLength(6) , maxLength: maxLength(20), },
        password_confirmation:  { sameAsPassword: sameAs('password') },
        name:                   { required, minLength: minLength(3) , maxLength: maxLength(20), },
        surname:                { required, minLength: minLength(3) , maxLength: maxLength(20), },
      }
    },

    created() {
      axios.get('http://localhost:8000/api/v1/profile')
      .then((response) => {
        this.user = response.data.data;
        this.profile = {
          email           : response.data.data.email,
          username        : response.data.data.username,
          name            : response.data.data.name,
          surname         : response.data.data.surname,
          roles           : response.data.data.roles,
          permissions     : response.data.data.permissions,
          all_permissions : response.data.data.all_permissions,
        };
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
          if(this.user.password === '') {
            this.user = {
              name        : this.user.name,
              surname     : this.user.surname,
              username    : this.user.username,
              email       : this.user.email,
              rememberMe  : this.user.rememberMe,
            }
          }

          axios.patch('http://localhost:8000/api/v1/profile', this.user)
          .then((response) => {
            this.profile = {
              email           : response.data.data.email,
              username        : response.data.data.username,
              name            : response.data.data.name,
              surname         : response.data.data.surname,
              roles           : response.data.data.roles,
              permissions     : response.data.data.permissions,
              all_permissions : response.data.data.all_permissions,
            };
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
        }
        this.disabled = this.$v.$invalid;
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
    },
  }
</script>