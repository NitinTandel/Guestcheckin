<template>
  <div id="SearchBooking">
    <v-stepper v-model="e1" dark>
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1" editable>
          Guest Name
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="e1 > 2" step="2" editable>
          Booking Details
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="e1 > 3" step="3" editable>
          Confirm
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-text-field v-model="guestName" label="Name" dense outlined required />
          <v-text-field v-model="guestMobile" label="Mobile No" dense outlined autocomplete="off" />
          <v-text-field v-model="hbookingref" label="Hotel Booking Referance" dense outlined autocomplete="off" />
          <v-text-field v-model="ibookingref" label="Travel Partner Booking Ref." dense outlined autocomplete="off" />

          <v-btn color="primary" @click="changeStep(2)">
            Search
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div v-if="!foundBooking">
            <v-alert dark dense icon="mdi-school" prominent>
              Booking details not found !
            </v-alert>

            <v-btn color="primary" @click="changeStep(3)">
              Search again
            </v-btn>

            <v-btn color="primary" @click="walkinClick()">
              Enter as Walk in
            </v-btn>
          </div>
          <div v-else>
            <center>Verify Booking</center>

            <v-text-field v-model="bookedFor" label="Booked for" dense outlined readonly />
            <v-text-field v-model="bookingDate" label="Booking Date" dense outlined readonly />
            <v-text-field v-model="guestCount" label="No of Guests" dense outlined readonly />

            <v-btn color="primary" @click="changeStep(3)">
              Verified
            </v-btn>

            <v-btn text>
              Cancel
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-alert
            color="blue-grey"
            dark
            dense
            icon="mdi-school"
            prominent
          >
            Default details copied from bookings. Please complete the remaining checkin formalities.
          </v-alert>

          <v-btn color="primary" @click="submitforChecking()">
            Check-in
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-snackbar v-model="snackbar" :timeout="timeout">
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
  </div>
</template>

<script>

export default {
  auth: false,

  data () {
    return {
      e1: 1,

      foundBooking: false,
      guestName: '',
      guestMobile: '',
      hbookingref: '',
      ibookingref: '',
      bookingDate: '',
      bookedFor: '',
      guestCount: 0,

      snackbar: false,
      text: 'Not able to find any booking details! Please try again',
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
  //    mounted () {
  //      this.e1 = this.currentStep
  //    },
  methods: {
    guestdetails (clickedIndex) {
      this.$router.push('/guests/' + clickedIndex)
    },
    async changeStep (val) {
      if (val === 2) {
        const nameArray = this.guestName.split()
        const shortName = nameArray[0]
        // Get the full file name from setup
        const dbfileNm = 'C:/guestcheckin/api/dbf/BOOK2021.DBF'
        const addrParam = {
          name: shortName,
          mobile: this.guestMobile,
          bookingRefHotByte: this.hbookingref,
          bookingRefThirdParty: this.ibookingref,
          dbfile: dbfileNm
        }
        const apiAddrdata = await this.$axios.post('/dbfapi/searchbooking', addrParam)

        if (apiAddrdata.data.Error) {
          this.foundBooking = false
        } else {
          this.foundBooking = true
          for (let i = 0; i < apiAddrdata.data.data.GuestList.length; i++) {
            const gName = apiAddrdata.data.data.GuestList[i].gFName + apiAddrdata.data.data.GuestList[i].gSName + apiAddrdata.data.data.GuestList[i].gTName
            const newdata = this.singleguestdata

            if (i === 0) {
              this.$store.commit('guestinfo/SET_BASEINFO', { name: gName })
              this.$store.commit('guestinfo/SET_BASEINFO', { mobile: this.guestMobile })
              this.$store.commit('guestinfo/SET_BASEINFO', { noofguests: apiAddrdata.data.data.GuestList.length })
              this.bookingDate = apiAddrdata.data.data.GuestList[i].bookingDate.substr(0, 10)
              this.bookedFor = gName
              this.guestCount = apiAddrdata.data.data.GuestList.length

            //      hbookingref: '',
            //      ibookingref: '',
            }
            newdata.name = gName
            newdata.add1 = apiAddrdata.data.data.GuestList[i].Add1
            newdata.add2 = apiAddrdata.data.data.GuestList[i].Add2
            newdata.city = apiAddrdata.data.data.GuestList[i].City
            newdata.pin = apiAddrdata.data.data.GuestList[i].Pin

            newdata.hotbyteBookingRef = apiAddrdata.data.data.GuestList[i].hotbyteFolio
            newdata.OtherBookingRef = apiAddrdata.data.data.GuestList[i].hotbyteFolio
            newdata.bookingDate = apiAddrdata.data.data.GuestList[i].bookingDate
            newdata.remark = apiAddrdata.data.data.GuestList[i].remark
            newdata.RoomNo = apiAddrdata.data.data.GuestList[i].RoomNo

            this.$store.commit('guestinfo/addGuest', newdata)
          }
        }
      }
      this.e1 = val
      this.currentStep = this.e1
    },

    walkinClick () {
      this.$store.commit('guestinfo/SET_BASEINFO', { name: this.guestName })
      this.$store.commit('guestinfo/SET_BASEINFO', { mobile: this.guestMobile })
      this.$store.commit('guestinfo/SET_BASEINFO', { noofguests: 1 })
      this.$router.push('/checkinForm')
    },
    submitforChecking () {
      this.$router.push('/checkinForm')
    }
  }
}
</script>
