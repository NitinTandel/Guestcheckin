<template>
  <div id="GCheckinMain">
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
          <!--
          <v-text-field :value="guestdata.name" label="Name" dense outlined @input="updateName" />
          <v-text-field :value="guestdata.mobile" label="Mobile No" dense outlined @input="updateMobile" />
-->
          <v-text-field v-model="guestName" label="Name" dense outlined />
          <v-text-field v-model="guestMobile" label="Mobile No" dense outlined />

          <v-container>
            <v-row>
              <v-text-field
                v-model="guestNumbers"
                label="No of Guests"
                type="number"
                style="width: 100px"
                dense
                outlined
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
          <div v-for="(item, index) in $store.state.guestinfo.alldata.guestlist" :key="index">
            <guestitem :guestindex="index" :guest-name="item.name" :completed="false" @guestdetailsClicked="guestdetails($event)" />
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
          <v-text-field label="Name" outlined />

          <v-alert
            color="blue-grey"
            dark
            dense
            icon="mdi-school"
            prominent
          >
            Thank you for providing your details. Please click Finish button to complete the checkin process.
          </v-alert>

          <v-btn color="primary" @click="e1 = 5">
            Continue
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'
// import { mapState } from 'vuex'
import guestitem from '~/components/guestitem'

// import { json } from 'express/lib/express'
export default {
  components: {
    guestitem
  },
  data () {
    return {
      e1: this.currentStep,

      singleguestdata: {
        name: '',
        mobile: '',
        mainguest: false,
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
        proof2id: ''
      }
    }
  },

  /*
  computed: mapState({
    guestdata: state => state.guestinfo.alldata

  }),
*/
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
      this.e1 = val
      this.currentStep = this.e1
    },

    plusGuest () {
      if (this.guestNumbers < 6) {
        // this.guestdata.noofguests++
        const newdata = this.singleguestdata
        //        this.guestdata.guestlist.push(newdata)
        this.$store.commit('guestinfo/addGuest', newdata)
      }
    },
    minusGuest () {
      if (this.guestNumbers > 1) {
        // this.guestdata.noofguests--
        // this.guestdata.guestlist.pop()
        this.$store.commit('guestinfo/removeGuest')
      }
    }

  }
}

</script>
