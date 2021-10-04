<template>
  <div>
    <div class="tw-flex tw-gap-x-2">
      <div @click="$router.back()" class="back tw-cursor-pointer tw-flex tw-items-center">
        <v-icon>mdi-chevron-left</v-icon>
        <span class="tw-text-base tw--ml-1">Back</span>
      </div>
    </div>
    <v-card class="elevation-1 tw-mt-2">
      <v-card-title class="tw-flex tw-items-center tw-gap-3">
        <span class="text-h5 tw-ml-2">Edit User</span>
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
                @input="$v.user.email.$touch()"
                @blur="$v.user.email.$touch()"
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
                @input="$v.user.username.$touch()"
                @blur="$v.user.username.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                label="Password*"
                type="password"
                v-model="user.password"
                :error-messages="passwordErrors"
                @input="$v.user.password.$touch()"
                @blur="$v.user.password.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                label="Confirm Password*"
                type="password"
                v-model="user.confirmPassword"
                :error-messages="confirmPasswordErrors"
                @input="$v.user.confirmPassword.$touch()"
                @blur="$v.user.confirmPassword.$touch()"
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
                @input="$v.user.name.$touch()"
                @blur="$v.user.name.$touch()"
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
                @input="$v.user.surname.$touch()"
                @blur="$v.user.surname.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-select
                label="Role*"
                persistent-hint
                v-model="user.roles"
                :items="roles"
                :error-messages="rolesErrors"
                @input="$v.user.roles.$touch()"
                @blur="$v.user.roles.$touch()"
                item-text="name"
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
                label="Permissions"
                multiple
                chips
                hint="Select if you want to define additional permissions for this user aside from the selected role(s)"
                persistent-hint
                v-model="user.permissions"
                :items="permissions"
                item-text="name"
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
              @click="save"
              :loading="loading"
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
        v-model="success"
        dismissible
        transition="scale-transition"
      >
        User updated. <router-link :to="`/users/${user.id}`" class="success-links">Show the user</router-link> | <router-link to="/users" class="success-links">Return to users list</router-link>
      </v-alert>
    </v-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators'
  import Localbase from 'localbase'
  let db = new Localbase('db')
  db.config.debug = false

  export default {
    data: () => ({
      success: false,
      loader: null,
      loading: false,
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
      roles                 : [],
      permissions           : [],
    }),
    
    mixins: [validationMixin],
    validations: {
      user: {
        email:            { required, minLength: minLength(6) , maxLength: maxLength(30), email, },
        username:         { required, minLength: minLength(5) , maxLength: maxLength(20), },
        password:         { required, minLength: minLength(6) , maxLength: maxLength(20), },
        confirmPassword:  { sameAsPassword: sameAs('password') },
        name:             { required, minLength: minLength(3) , maxLength: maxLength(20), },
        surname:          { required, minLength: minLength(3) , maxLength: maxLength(20), },
        roles:            { required, },
      }
    },

    computed: {
      ...mapGetters([
        'data',
      ]),

      emailErrors () {
        const errors = []
        if (!this.$v.user.email.$dirty) return errors
        !this.$v.user.email.minLength && errors.push('Email must be minimum 6 characters long')
        !this.$v.user.email.maxLength && errors.push('Email must be at most 30 characters long')
        !this.$v.user.email.required && errors.push('Email is required.')
        !this.$v.user.email.email && errors.push('Email must be a valid email.')
        return errors
      },

      usernameErrors () {
        const errors = []
        if (!this.$v.user.username.$dirty) return errors
        !this.$v.user.username.minLength && errors.push('Username must be minimum 5 characters long')
        !this.$v.user.username.maxLength && errors.push('Username must be at most 20 characters long')
        !this.$v.user.username.required && errors.push('Username is required.')
        return errors
      },

      passwordErrors () {
        const errors = []
        if (!this.$v.user.password.$dirty) return errors
        !this.$v.user.password.minLength && errors.push('Password must be minimum 6 characters long')
        !this.$v.user.password.maxLength && errors.push('Password must be at most 20 characters long')
        !this.$v.user.password.required && errors.push('Password is required.')
        return errors
      },

      confirmPasswordErrors () {
        const errors = []
        if (!this.$v.user.confirmPassword.$dirty) return errors
        !this.$v.user.confirmPassword.sameAsPassword && errors.push('Passwords must be identical')
        return errors
      },

      nameErrors () {
        const errors = []
        if (!this.$v.user.name.$dirty) return errors
        !this.$v.user.name.minLength && errors.push('Name must be minimum 3 characters long')
        !this.$v.user.name.maxLength && errors.push('Name must be at most 20 characters long')
        !this.$v.user.name.required && errors.push('Name is required.')
        return errors
      },

      surnameErrors () {
        const errors = []
        if (!this.$v.user.surname.$dirty) return errors
        !this.$v.user.surname.minLength && errors.push('Surname must be minimum 3 characters long')
        !this.$v.user.surname.maxLength && errors.push('Surname must be at most 20 characters long')
        !this.$v.user.surname.required && errors.push('Surname is required.')
        return errors
      },

      rolesErrors () {
        const errors = []
        if (!this.$v.user.roles.$dirty) return errors
        !this.$v.user.roles.required && errors.push('Role is required.')
        return errors
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

    created() {
      const userIdFromPath = parseInt(this.$route.fullPath.split('/')[2])
      this.user.id = userIdFromPath
      db.collection('roles').get().then(roles => {
        this.roles = roles
      })
      db.collection('permissions').get().then(permissions => {
        this.permissions = permissions
      })
      db.collection('users').doc({id: userIdFromPath}).get().then(user => {
        // console.log(user)
        this.user = user
      })
    },

    methods: {
      save () {
        this.success = false
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.loader = 'loading';
          setTimeout(() => {
            this.$store.dispatch('table', 'users')
            this.$store.dispatch('showUpdate', this.user)
            this.success = true
            this.$v.$reset()
          }, 500)
        }
      },
      toggle () {
        this.$nextTick(() => {
          if (this.allPermissions) {
            this.user.permissions = ""
          } else {
            this.user.permissions = this.permissions.slice()
            this.user.permissions = this.permissions.map(({ id }) => id)
            console.log(this.user.permissions)
          }
        })
      },
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 500)

        this.loader = null
      },
    },
  }
</script>

<style scoped>

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>
