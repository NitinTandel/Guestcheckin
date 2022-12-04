<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          Welcome to {{ this.$store.state.guestinfo.HotelName }}
        </v-card-title>
        <v-card-text>
          <br>
          <p>Kindly fill up the checking form. Please click on below button. </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            to="/checkinForm"
          >
            Walk in
          </v-btn>
          <v-btn
            color="primary"
            to="/searchbooking"
          >
            Pre-booking
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

export default {
//  middleware: 'notAuthenticated',
  auth: false,

  data () {
    return {
      msg: 'xxxxxxxx xxxx'
    }
  }
}
</script>
