<template>
  <div class="tw-flex tw-justify-between tw-gap-4">
    <div class="tw-w-3/12">
      <div class="tw-bg-red-100 tw-pt-6 tw-pb-4">
        <v-img src="@/assets/img/profile-big.jpeg" class="tw-w-52 tw-max-h-52 tw-rounded-full tw-mx-auto tw-border-5 tw-border-red-500"></v-img>
        <div class="tw-flex tw-flex-col tw-items-center tw-mt-6 tw-gap-1">
          <span class="tw-text-xl tw-font-bold">{{ $store.state.data.name + ' ' + $store.state.data.surname }}</span>
          <span class="tw-text-red-500 tw-font-semibold">{{ $store.state.data.role }}</span>
          <span>@{{ $store.state.data.username }}</span>
          <span>{{ $store.state.data.email }}</span>
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
      <v-card-title>
        <span class="text-h5">Edit Profile</span>
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
                label="Email"
                required
                v-model="profileDatas.email"
                :error-messages="emailErrors"
                @input="$v.profileDatas.email.$touch()"
                @blur="$v.profileDatas.email.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                label="Username"
                v-model="profileDatas.username"
                :error-messages="usernameErrors"
                @input="$v.profileDatas.username.$touch()"
                @blur="$v.profileDatas.username.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                label="Password"
                v-model="profileDatas.password"
                :error-messages="passwordErrors"
                @input="$v.profileDatas.password.$touch()"
                @blur="$v.profileDatas.password.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                label="Confirm Password"
                v-model="profileDatas.confirmPassword"
                :error-messages="confirmPasswordErrors"
                @input="$v.profileDatas.confirmPassword.$touch()"
                @blur="$v.profileDatas.confirmPassword.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                label="Name"
                v-model="profileDatas.name"
                :error-messages="nameErrors"
                @input="$v.profileDatas.name.$touch()"
                @blur="$v.profileDatas.name.$touch()"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                label="Surname"
                v-model="profileDatas.surname"
                :error-messages="surnameErrors"
                @input="$v.profileDatas.surname.$touch()"
                @blur="$v.profileDatas.surname.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-select
                label="Role"
                persistent-hint
                v-model="profileDatas.role"
                :items="roles"
              >
              </v-select>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-select
                label="Permissions"
                hint="Select if you want to define additional permissions for this user"
                multiple
                chips
                persistent-hint
                v-model="profileDatas.permissions"
                :items="permissions"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    ripple
                    @click="toggle"
                  >
                    <v-list-item-action>
                      <v-icon :color="profileDatas.permissions.length > 0 ? 'indigo darken-4' : ''">
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
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="tw-mr-3"
          @click="save"
          :loading="loading"
        >
          Save
        </v-btn>
      </v-card-actions>
      <v-alert
        dense
        type="success"
        class="tw-mx-4 tw-mt-3"
        v-model="success"
        dismissible
        transition="scale-transition"
      >
        Profile updated.
      </v-alert>
      <v-alert
        :value="error"
        type="error"
        transition="scale-transition"
        style="margin-top: 20px; position: absolute; width:100%;"
      >
        {{ errors.message }}
      </v-alert>
    </v-card>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { validationMixin } from 'vuelidate'
  import { required, minLength, maxLength, email, } from 'vuelidate/lib/validators'
  import Localbase from 'localbase'
  import UserRecords from '@/components/UserRecords.vue';

  let db = new Localbase('db')
  db.config.debug = false
  
  export default {
    name: 'Profile',
    components: {
      UserRecords,
    },

    mixins: [validationMixin],
    validations: {
      profileDatas: {
        email:            { required, minLength: minLength(3) , maxLength: maxLength(30), email },
        username:         { required, minLength: minLength(3) , maxLength: maxLength(20) },
        password:         { required, minLength: minLength(3) , maxLength: maxLength(20) },
        confirmPassword:  { required, minLength: minLength(3) , maxLength: maxLength(20) },
        name:             { required, minLength: minLength(3) , maxLength: maxLength(20) },
        surname:          { required, minLength: minLength(3) , maxLength: maxLength(20) },
      }
    },

    data: () => ({
      success: false,
      error: false,
      loader: null,
      loading: false,
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
      profileDatas: {
        id: 1,
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        role: '',
        permissions: [],
      },
      roles: [],
      permissions: [],
    }),

    computed: {
      ...mapGetters([
        'data',
        'datas',
        'dataIndex',
        'errors',
      ]),

      emailErrors () {
        const errors = []
        if (!this.$v.profileDatas.email.$dirty) return errors
        !this.$v.profileDatas.email.minLength && errors.push('Email must be minimum 3 characters long')
        !this.$v.profileDatas.email.maxLength && errors.push('Email must be at most 30 characters long')
        !this.$v.profileDatas.email.required && errors.push('Email is required.')
        !this.$v.profileDatas.email.email && errors.push('Email must be a valid email.')
        return errors
      },

      usernameErrors () {
        const errors = []
        if (!this.$v.profileDatas.username.$dirty) return errors
        !this.$v.profileDatas.username.minLength && errors.push('Username must be minimum 3 characters long')
        !this.$v.profileDatas.username.maxLength && errors.push('Username must be at most 20 characters long')
        !this.$v.profileDatas.username.required && errors.push('Username is required.')
        return errors
      },

      passwordErrors () {
        const errors = []
        if (!this.$v.profileDatas.password.$dirty) return errors
        !this.$v.profileDatas.password.minLength && errors.push('Password must be minimum 3 characters long')
        !this.$v.profileDatas.password.maxLength && errors.push('Password must be at most 20 characters long')
        !this.$v.profileDatas.password.required && errors.push('Password is required.')
        return errors
      },

      confirmPasswordErrors () {
        const errors = []
        if (!this.$v.profileDatas.confirmPassword.$dirty) return errors
        !this.$v.profileDatas.confirmPassword.minLength && errors.push('Confirm Password must be minimum 3 characters long')
        !this.$v.profileDatas.confirmPassword.maxLength && errors.push('Confirm Password must be at most 20 characters long')
        !this.$v.profileDatas.confirmPassword.required && errors.push('Confirm Password is required.')
        return errors
      },

      nameErrors () {
        const errors = []
        if (!this.$v.profileDatas.name.$dirty) return errors
        !this.$v.profileDatas.name.minLength && errors.push('Name must be minimum 3 characters long')
        !this.$v.profileDatas.name.maxLength && errors.push('Name must be at most 20 characters long')
        !this.$v.profileDatas.name.required && errors.push('Name is required.')
        return errors
      },

      surnameErrors () {
        const errors = []
        if (!this.$v.profileDatas.surname.$dirty) return errors
        !this.$v.profileDatas.surname.minLength && errors.push('Surname must be minimum 3 characters long')
        !this.$v.profileDatas.surname.maxLength && errors.push('Surname must be at most 20 characters long')
        !this.$v.profileDatas.surname.required && errors.push('Surname is required.')
        return errors
      },

      allPermissions () {
        return this.data.permissions.length === this.permissions.length
      },
      somePermissions () {
        return this.data.permissions.length > 0 && !this.allPermissions
      },
      selectAllIcon () {
        if (this.allPermissions) return 'mdi-close-box'
        if (this.somePermissions) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },

    created () {
      db.collection('roles').get().then(datas => {
        this.roles = datas.map(({ name }) => name)
      })
      db.collection('permissions').get().then(datas => {
        this.permissions = datas.map(({ name }) => name)
      })

      this.$store.dispatch('table', 'users')
      this.$store.dispatch('show', {
        table: 'users',
        id: 1,
      })
      setTimeout(() => {
        this.profileDatas.id              = this.data.id
        this.profileDatas.email           = this.data.email
        this.profileDatas.username        = this.data.username
        this.profileDatas.password        = this.data.password
        this.profileDatas.confirmPassword = this.data.confirmPassword
        this.profileDatas.name            = this.data.name
        this.profileDatas.surname         = this.data.surname
        this.profileDatas.role            = this.data.role
        this.profileDatas.permissions     = this.data.permissions
      }, 500)
    },

    methods: {
      save () {
        this.success = false
        this.$v.$touch()
        if (this.$v.$invalid) {
        } else {
          this.loader = 'loading';
          setTimeout(() => {
            this.$store.dispatch('showUpdate', this.profileDatas)
            this.success = true
          }, 500)
        }
      },
      toggle () {
        this.$nextTick(() => {
          if (this.allPermissions) {
            this.$store.dispatch('defaultData')
          } else {
            this.$store.dispatch('dataPermissions', this.permissions.slice())
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
