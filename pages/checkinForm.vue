<template>
  <!--  <div id="GCheckinMain"> -->
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-stepper v-model="e1" dark>
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1" editable>
          Guest Name
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="e1 > 2" step="2" editable>
          Guest List
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="e1 > 3" step="3" editable>
          Confirm
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-text-field
            v-model="guestName"
            label="Name"
            class="upper-input"
            :rules="nameRules"
            dense
            outlined
            required
            autocomplete="off"
          />
          <v-text-field v-model="guestMobile" label="Mobile No" dense outlined autocomplete="off" />

          <v-container>
            <v-row>
              <v-text-field
                v-model="guestNumbers"
                label="No of Guests"
                type="number"
                style="width: 100px"
                dense
                outlined
                readonly
              />
              <v-btn
                class="mx-1"
                fab
                dark
                small
                color="indigo"
                @click="plusGuest()"
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>

              <v-btn
                class="mx-1"
                fab
                dark
                small
                color="primary"
                @click="minusGuest"
              >
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-row>
          </v-container>

          <v-btn color="primary" @click="changeStep(2)">
            Continue
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <center>Guest List</center>
          <div v-for="(item, index) in $store.state.guestinfo.alldata.guestlist" :key="index">
            <guestitem :guestindex="index" :guest-name="item.name" :completed="item.dataDone" @guestdetailsClicked="guestdetails($event)" />
            <v-divider />
          </div>

          <v-btn color="primary" @click="changeStep(3)">
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-alert
            color="blue-grey"
            dark
            dense
            icon="mdi-school"
            prominent
          >
            Thank you for providing your details. Please click Finish button to complete the checkin process.
          </v-alert>

          <v-btn color="primary" @click="submitToDB()">
            Submit Data
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!--  </div> -->
  </v-form>
</template>

<style>

.upper-input input{
  text-transform: uppercase
}
</style>

<script>

import guestitem from '~/components/guestitem'

export default {
  auth: false,

  components: {
    guestitem
  },
  data () {
    return {
      e1: this.currentStep,

      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 50) || 'Name must be less than 50 characters'
      ],

      snackbar: false,
      text: 'You must complete data entry for all guests!',
      timeout: 2000,

      singleguestdata: {
        name: '',
        mobile: '',
        mainguest: true,
        res_type: '',
        nationality: '',
        email: '',
        add1: '',
        add2: '',
        add3: '',
        add4: '',
        city: '',
        state: '',
        country: '',
        pin: '',
        proof1type: '',
        proof2type: '',
        proof1id: '',
        proof2id: '',
        uploadfile1: '',
        serverfile1: '',
        uploadfile2: '',
        serverfile2: '',
        signfile: '',
        hotbyteBookingRef: '',
        OtherBookingRef: '',
        bookingDate: '',
        remark: '',
        RoomNo: '',
        dataDone: false
      }
    }
  },
  computed: {
    guestName: {
      get () { return this.$store.state.guestinfo.alldata.name },
      set (value) { this.$store.commit('guestinfo/SET_BASEINFO', { name: value }) }
    },

    guestMobile: {
      get () { return this.$store.state.guestinfo.alldata.mobile },
      set (value) { this.$store.commit('guestinfo/SET_BASEINFO', { mobile: value }) }
    },

    guestNumbers: {
      get () { return this.$store.state.guestinfo.alldata.noofguests },
      set (value) { this.$store.commit('guestinfo/SET_BASEINFO', { noofguests: value }) }
    },

    currentStep: {
      get () { return this.$store.state.guestinfo.baseStepNo },
      set (value) { this.$store.commit('guestinfo/SET_STEPNO', value) }
    }

  },
  mounted () {
    this.e1 = this.currentStep
  },
  methods: {
    guestdetails (clickedIndex) {
      this.$router.push('/guests/' + clickedIndex)
    },
    changeStep (val) {
      if (val === 3) {
        let enteredFullData = true
        for (let i = 0; i < this.$store.state.guestinfo.alldata.guestlist.length; i++) {
          if (!this.$store.state.guestinfo.alldata.guestlist[i].dataDone) {
            enteredFullData = false
            break
          }
        }
        if (!enteredFullData) {
          this.snackbar = true
        } else {
          this.e1 = val
          this.currentStep = this.e1
        }
      } else {
        this.e1 = val
        this.currentStep = this.e1
      }
    },

    plusGuest () {
      if (this.guestNumbers < 6) {
        const newdata = this.singleguestdata
        this.$store.commit('guestinfo/addGuest', newdata)
      }
    },
    minusGuest () {
      if (this.guestNumbers > 1) {
        this.$store.commit('guestinfo/removeGuest')
      }
    },
    submitToDB () {
      this.$axios
        .post('/checkin/register', this.$store.state.guestinfo.alldata)
        .then((response) => {
          this.$router.push('/finish')
        })
        .catch((error) => {
          alert(error.message)
        })
    }
  }
}
</script>
