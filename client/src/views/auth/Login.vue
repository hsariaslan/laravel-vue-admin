<template>
  <v-form>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          prepend-icon="mdi-account"
          name="login"
          label="E-mail"
          type="text"
          required
          v-model="user.email"
          :error-messages="emailErrors"
          @input="$v.user.email.$touch()"
          @blur="$v.user.email.$touch()"
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-lock"
          name="password"
          label="Password"
          type="password"
          required
          v-model="user.password"
          :error-messages="passwordErrors"
          @input="$v.user.password.$touch()"
          @blur="$v.user.password.$touch()"
        ></v-text-field>
        <v-checkbox
          v-model="user.rememberMe"
          label="Remember me"
          color="primary"
          hide-details
          class="mr-4"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions class="d-sm-flex justify-space-between">
        <router-link to="/forget-password" class="float-left mt-3 ml-3 text-body-2">Forget password?</router-link>
        <v-btn
          color="primary"
          class="mr-2 mt-3 mb-2"
          :disabled="$v.$invalid || !valid"
          :loading="loading"
          @click="loginAttempt"
        >
          Login
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </v-card-actions>
      <v-alert
        :value="alert"
        type="error"
        transition="scale-transition"
        style="margin-top: 20px; position: absolute; width:100%;"
      >
        {{ this.error.message }}
      </v-alert>
    </v-card>
  </v-form>
</template>

<script>
  import { mapGetters } from "vuex";
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, minLength, email, } from 'vuelidate/lib/validators'
  export default {
    name: 'Login',
    mixins: [validationMixin],
    validations: {
      user: {
        email: { required, minLength: minLength(6), maxLength: maxLength(30), email },
        password: { required, minLength: minLength(6), maxLength: maxLength(20) },
      }
    },

    data: () => ({
      user: {
        email: "admin@sariaslan.com",
        password: "123456",
        rememberMe: false,
      },
      errors: [],
      error: {},
      submitStatus: '',
      valid: true,
      loader: null,
      loading: false,
      alert: false,
    }),

    methods: {
      async loginAttempt() {
        this.valid = false
        this.alert = false
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
          this.loader = 'loading';
          this.submitStatus = 'PENDING'
          this.valid = true
          this.$store.dispatch('auth/login', this.user)
          .then(uri => {
            this.$router.push(uri)
          })
          .catch(err => {
            console.log(err.response.data.message)
            this.error = {
              status: err.response.status,
              message: err.response.data.message
            }
            this.alert = true
          })
        }
      }
    },

    computed: {
      ...mapGetters(['auth/login', 'auth/errors']),
      emailErrors () {
        const errors = []
        if (!this.$v.user.email.$dirty) return errors
        !this.$v.user.email.minLength && errors.push('Email must be minimum 6 characters long')
        !this.$v.user.email.maxLength && errors.push('Email must be at most 20 characters long')
        !this.$v.user.email.required && errors.push('Email is required.')
        !this.$v.user.email.email && errors.push('Email is not valid.')
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
    },

    created() {
      let token = localStorage.getItem('token')
      if(typeof(token) !== 'undefined' && token !== null && token !== 'null' && token !== '') {
        this.$router.push("/")
      } else {
        token = sessionStorage.getItem('token')
        if(typeof(token) !== 'undefined' && token !== null && token !== 'null' && token !== '') {
          this.$router.push("/")
        }
      }
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 500)

        this.loader = null
      },
    },
  };
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
