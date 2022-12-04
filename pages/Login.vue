<template>
  <div class="Login">
    <v-container class="my-5">
      <v-layout align-center justify-center>
        <v-flex xs12 sm4 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer />
              <!--
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    large
                    n-link
                    to="/"
                    v-on="on"
                  >
                    <v-icon large>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </template>
                <span>Close without login</span>
              </v-tooltip>
-->
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  id="userID"
                  v-model="loginInfo.userid"
                  prepend-icon="mdi-account"
                  name="userid"
                  label="User ID"
                  type="text"
                />
                <v-text-field
                  id="userPwd"
                  v-model="loginInfo.userPwd"
                  prepend-icon="mdi-lock"
                  name="userPwd"
                  label="Password"
                  :type="show1 ? 'text' : 'password'"
                  autocomplete="on"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show1 = !show1"
                />
              </v-form>
            </v-card-text>

            <!--            <div v-if="isLoginError">
              <Notification :message="errorMessage" />
-->
            <v-snackbar v-model="isLoginError" :timeout="2000">
              {{ errorMessage }}
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="primary"
                @click="isLoginErrorr = false"
              >
                <v-icon dark>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-snackbar>

            <!--
            </div>
-->
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" :loading="loading" :disabled="loading" @click="userLogin">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// import Notification from '../components/Notification'

export default {
  name: 'LoginForm',
  //  components: {
  //    Notification
  //  },
  data () {
    return {
      loginInfo: {
        userid: 'Admin',
        userPwd: 'Admin'
      },
      isLoginError: false,
      errorMessage: '',
      loading: false,
      show1: false
    }
  },
  methods: {
    async userLogin () {
      try {
        const response = await this.$auth.loginWith('local', { data: this.loginInfo })
        if (response.data === '') {
          this.isLoginError = true
          this.errorMessage = 'Login Failed'
        }
        //        console.log(response)
      } catch (err) {
        //        console.log(err)
      }
    }
  }
}
</script>
