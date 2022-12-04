<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <div id="SingleGuestForm">
      <v-stepper v-model="e1" dark>
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1" editable>
            Name
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 2" step="2" editable>
            Address
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 3" step="3" editable>
            Id Details
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 4" step="4" editable>
            Id Proof
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="e1 > 5" step="5" editable>
            Other guests
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-text-field
              v-model="guestdata.name"
              label="Name"
              class="upper-input"
              dense
              outlined
              autocomplete="off"
              :rules="nameRules"
            />
            <v-text-field v-model="guestdata.mobile" label="Mobile No" dense outlined autocomplete="off" />
            <v-text-field
              v-model="guestdata.email"
              label="Email id"
              dense
              outlined
              autocomplete="false"
              :rules="emailRules"
            />

            <v-select
              v-model="guestdata.res_type"
              :items="ResidanceTypes"
              label="Residance"
              outlined
              dense
              @click="updateNationality()"
            />
            <!--            <v-text-field v-model="guestdata.nationality" label="Nationality" dense outlined :readonly="!nationalityReadonly" /> -->

            <v-autocomplete
              v-model="guestdata.nationality"
              :items="nationalitylist"
              :filter="nationalityFilter"
              color="white"
              item-text="name"
              label="Nationality"
              dense
              outlined
              :readonly="!nationalityReadonly"
            />

            <v-btn color="primary" @click="updateStore(1)">
              Continue
            </v-btn>
            <v-btn text @click="cancelClick()">
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div v-if="paramVal>0">
              <v-btn
                color="primary"
                dense
                @click="copyAddress()"
              >
                copy from Guest 1
              </v-btn>
            </div>

            <v-text-field v-model="guestdata.add1" label="Address" dense class="upper-input" />
            <v-text-field v-model="guestdata.add2" label="Address" dense class="upper-input" />
            <v-text-field v-model="guestdata.add3" label="Address" dense class="upper-input" />

            <v-text-field v-model="guestdata.city" label="Dist. / City" dense class="upper-input" />
            <v-text-field v-model="guestdata.state" label="State" dense class="upper-input" />
            <v-text-field v-model="guestdata.pin" label="Pin" dense class="upper-input" />

            <v-autocomplete
              v-model="guestdata.country"
              :items="countrylist"
              :filter="countryFilter"
              color="white"
              item-text="Name"
              label="Country"
              dense
            />
            <v-btn color="primary" @click="e1 = 1">
              Back
            </v-btn>

            <v-btn color="primary" @click="updateStore(2)">
              Continue
            </v-btn>
          <!--
          <v-btn text @click="cancelClick()">
            Cancel
          </v-btn>
-->
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-select
              v-model="guestdata.proof1type"
              :items="idTypes"
              label="Photo Id"
              dense
              outlined
              :disabled="!!lProof1File"
            />
            <v-text-field v-model="guestdata.proof1id" :label="guestdata.proof1type +' Number'" dense outlined :disabled=" guestdata.proof1type.length < 1 || !!lProof1File" />
            <v-file-input v-model="lProof1File" small-chips label="upload file" :disabled="guestdata.proof1id.length < 2" @change="onAddProof1Files" />

            <v-select
              v-model="guestdata.proof2type"
              :items="idTypes"
              label="Address Id"
              outlined
              dense
              :disabled="!!lProof2File"
            />
            <v-text-field v-model="guestdata.proof2id" :label="guestdata.proof2type +' Number'" dense outlined :disabled="guestdata.proof2type.length < 1 || !!lProof2File" />
            <v-file-input v-model="lProof2File" small-chips label="upload file" :disabled="guestdata.proof2id.length < 2" @change="onAddProof2Files" />

            <v-btn color="primary" @click="e1 = 2">
              Back
            </v-btn>

            <v-btn color="primary" @click="updateStore(3)">
              Continue
            </v-btn>

          <!--
          <v-btn text @click="cancelClick()">
            Cancel
          </v-btn>
-->
          </v-stepper-content>

          <v-stepper-content step="4">
            <div v-if="!showcanvas">
              <img
                id="canvas-image"
                ref="img"
                :src="signImg"
                width="300"
                height="200"
              >
            </div>
            <!--            <canvas id="drawing-pad" ref="canvas" width="300" height="200" :visible="showcanvas" /> -->
            <canvas
              id="drawing-pad"
              ref="canvas"
              width="300"
              height="200"
              :class="{hidemeClass : !showcanvas }"
            />

            <v-btn @click="resetClicked()">
              Reset
            </v-btn>
            <!--
          <v-btn @click="saveImage">
            Save Sign
          </v-btn>

          <small>Right Click to save Signature</small>
-->
            <v-btn color="primary" @click="e1 = 3">
              Back
            </v-btn>

            <v-btn color="primary" @click="updateStore(4)">
              Continue
            </v-btn>

          <!--
          <v-btn text @click="cancelClick()">
            Cancel
          </v-btn>
-->
          </v-stepper-content>

          <v-stepper-content step="5">
            <v-alert
              color="blue-grey"
              dark
              dense
              icon="mdi-school"
              prominent
            >
              Guest Infomation Added. To add Information for another guest or to finish checkin process, click finish button.
            </v-alert>

            <v-btn color="primary" @click="e1 = 4">
              Back
            </v-btn>

            <v-btn color="primary" @click="finishGuestInfo()">
              Done
            </v-btn>

            <v-btn text @click="cancelClick()">
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
  </v-form>
</template>

<style>

  canvas {
    background: white;
    cursor: crosshair;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
  }
.hidemeClass {
  visibility:hidden;
  height:2px
}

.showmeClass {
  visibility:visible
}

.upper-input input{
  text-transform: uppercase
}
</style>

<script>

export default {
  auth: false,
  validate ({ params }) {
    // Must be a number
    if (/^\d+$/.test(params.id)) {
      // check no of guests
      return true
      // return params.id <= this.$store.state.guestinfo.alldata.noofguests
    } else {
      return false
    }
  },
  data () {
    return {
      e1: 1,
      paramVal: this.$route.params.id,

      // guestdata: this.$store.state.guestinfo.alldata.guestlist[this.$route.params.id],

      guestdata: JSON.parse(JSON.stringify(this.$store.state.guestinfo.alldata.guestlist[this.$route.params.id])),
      ResidanceTypes: ['Local', 'Foreigner'],

      valid: true,

      emailRules: [
        //        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],

      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 50) || 'Name must be less than 50 characters'
      ],

      countrylist: [],
      nationalitylist: [],
      nationalityReadonly: false,

      idTypes: ['Passport', 'Aadhar', 'Driving License', 'PAN'],
      //      idProofTypes: ['Passport ', 'Aadhar Card', 'Driving License', 'PAN Card']

      lProof1File: null,
      lProof2File: null,
      signImg: '',
      showcanvas: true,

      canvas: null,
      context: null,
      isDrawing: false,
      startX: 0,
      startY: 0,
      points: []
    }
  },
  computed: {

  },

  mounted () {
    const vm = this
    vm.canvas = vm.$refs.canvas
    vm.context = vm.canvas.getContext('2d')
    vm.canvas.addEventListener('mousedown', vm.mousedown)
    vm.canvas.addEventListener('mousemove', vm.mousemove)
    document.addEventListener('mouseup', vm.mouseup)

    vm.canvas.addEventListener('touchstart', vm.touchstart)
    vm.canvas.addEventListener('touchmove', vm.touchmove)
    document.addEventListener('touchend', vm.touchend)

    this.$store.commit('guestinfo/SET_CURRENTGUEST', this.$route.params.id)
  },

  created () {
    this.initialize()
    //    console.log(this.guestdata)
    //    this.signImg = this.guestdata.signfile
    // console.log(this.signImg)
    // console.log(this.guestdata.signfile)

    if (this.guestdata.signfile.length > 2) {
      this.showcanvas = false
      this.signImg = 'http://192.168.0.102:3001/' + this.guestdata.signfile
    }
  },

  methods: {
    async initialize () {
      try {
        const iddata = await this.$axios.get('/checkin/prooftypes')
        for (let i = 0; i < iddata.data.length; i++) {
          this.idTypes.push(iddata.data[i].Proof_type)
        }

        const apidata = await this.$axios.get('/checkin/countries')
        this.countrylist = apidata.data

        const apidata2 = await this.$axios.get('/checkin/nationalities')
        this.nationalitylist = apidata2.data
      } catch (error) {
        this.msgText = error.message
      };
    },

    updateNationality () {
      if (this.guestdata.res_type === 'Local') {
        this.guestdata.nationality = this.$store.state.guestinfo.LocalNationality
        this.guestdata.country = this.$store.state.guestinfo.HotelCountry
        this.nationalityReadonly = true
      } else {
        this.nationalityReadonly = false
      }
    },

    async updateStore (stepNo) {
      if (stepNo === 1) {
        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { name: this.guestdata.name } })
        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { mobile: this.guestdata.mobile } })

        const nameArray = this.guestdata.name.split()
        const shortName = nameArray[0]

        // Get the full file name from setup
        const dbfileNm = 'C:/guestcheckin/api/dbf/GHIS2021.MST'

        const addrParam = {
          name: shortName,
          mobile: this.guestdata.mobile,
          dbfile: dbfileNm
        }

        const apiAddrdata = await this.$axios.post('/dbfapi/ghistory', addrParam)
        if (typeof apiAddrdata.data.data === 'undefined') {
          //          if (this.guestdata.res_type === 'Local') {
          //            this.guestdata.nationality = this.$store.state.guestinfo.LocalNationality
          //           this.guestdata.country = this.$store.state.guestinfo.HotelCountry
          //         }
        } else {
          this.guestdata.add1 = apiAddrdata.data.data.ADD1
          this.guestdata.add2 = apiAddrdata.data.data.ADD2
          this.guestdata.city = apiAddrdata.data.data.CITY
          // this.guestdata.country = apiAddrdata.data.data.COUNTRY
          this.guestdata.pin = apiAddrdata.data.data.PIN

          if (apiAddrdata.data.data.RES_TYPE === 'L') {
            this.guestdata.res_type = 'Local'
          } else {
            this.guestdata.res_type = 'Foreigner'
          }
          //        this.guestdata.nationality = apiAddrdata.data.data.NATIONALITY
        }
      }
      if (stepNo === 2) {
        if (this.guestdata.res_type === 'Local') {
          this.guestdata.nationality = this.$store.state.guestinfo.LocalNationality
          this.guestdata.country = this.$store.state.guestinfo.HotelCountry
        }

        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { add1: this.guestdata.add1 } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { add2: this.guestdata.add2 } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { add3: this.guestdata.add3 } })
        //        //      this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { add4: guestdata.add4 } })

        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { city: this.guestdata.city } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { state: this.guestdata.state } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { country: this.guestdata.country } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { pin: this.guestdata.pin } })
      }
      if (stepNo === 3) {
        // alert(this.signImg)
        // alert(this.guestdata.signfile)
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { proof1type: this.guestdata.proof1type } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { proof1id: this.guestdata.proof1id } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { proof2type: this.guestdata.proof2type } })
        //        this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { proof2id: this.guestdata.proof2id } })
      }

      if (stepNo === 4) {
        if (this.showcanvas) {
          this.saveImage()
        }
      }

      this.e1 = stepNo + 1
    },

    finishGuestInfo () {
      let allDataEntered = false

      if (this.guestdata.name.length > 0 &&
      this.guestdata.mobile.length > 0 &&
      this.guestdata.nationality.length > 0 &&
      this.guestdata.email.length > 0) {
        allDataEntered = true
      }

      if (this.guestdata.add1.length > 0 &&
      this.guestdata.city.length > 0 &&
       this.guestdata.state.length > 0 &&
       this.guestdata.country.length > 0 &&
       this.guestdata.pin.length > 0
      ) {
        if (allDataEntered) {
          allDataEntered = true
        } else {
          allDataEntered = false
        }
      }

      if (this.guestdata.proof1type.length > 0 &&
      this.guestdata.proof2type.length > 0 &&
      this.guestdata.proof1id.length > 0 &&
      this.guestdata.proof2id.length > 0 &&
      this.guestdata.serverfile1.length > 0 &&
      this.guestdata.serverfile2.length > 0 &&
      this.guestdata.signfile.length > 0) {
        if (allDataEntered) {
          allDataEntered = true
        } else {
          allDataEntered = false
        }
      }

      this.guestdata.dataDone = allDataEntered

      this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: this.guestdata })
      this.$router.push('/checkinForm')
    },

    cancelClick () {
      this.$router.push('/checkinForm')
    },

    copyAddress () {
      this.guestdata.add1 = this.$store.state.guestinfo.alldata.guestlist[0].add1
      this.guestdata.add2 = this.$store.state.guestinfo.alldata.guestlist[0].add2
      this.guestdata.add3 = this.$store.state.guestinfo.alldata.guestlist[0].add3
      //      this.guestdata.add4 = this.$store.state.guestinfo.alldata.guestlist[this.$route.params.id].add1
      this.guestdata.city = this.$store.state.guestinfo.alldata.guestlist[0].city
      this.guestdata.state = this.$store.state.guestinfo.alldata.guestlist[0].state
      this.guestdata.country = this.$store.state.guestinfo.alldata.guestlist[0].country
      this.guestdata.pin = this.$store.state.guestinfo.alldata.guestlist[0].pin

      // this.$store.commit('guestinfo/SET_COPYADDRESS', { id: this.$route.params.id })
    },

    onAddProof1Files () {
      if (this.lProof1File) {
        const formData = new FormData()

        formData.append('photo', this.lProof1File, this.lProof1File.name)
        formData.append('proofType', this.gProof1type)

        this.$axios
          .post('/fileupload/proof', formData)
          .then((response) => {
            const fullfilepath = response.data.filenm
            this.guestdata.serverfile1 = fullfilepath
            //            this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { serverfile1: fullfilepath } })
          })
          .catch((error) => {
            alert(error.message)
            // console.log({ error })
          })
      } else {
        alert('there are no files.')
      }
    },

    onAddProof2Files () {
      if (this.lProof2File) {
        const formData = new FormData()

        formData.append('photo', this.lProof2File, this.lProof2File.name)
        formData.append('proofType', 'Test')

        this.$axios
          .post('/fileupload/proof', formData)
          .then((response) => {
            const fullfilepath = response.data.filenm
            this.guestdata.serverfile2 = fullfilepath
            // this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { serverfile2: fullfilepath } })
          })
          .catch((error) => {
            // console.log({ error })
            alert(error.message)
          })
      } else {
        alert('there are no files.')
      }
    },

    countryFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.Name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    nationalityFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    stateFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    cityFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    touchstart (event) {
      const vm = this
      vm.mousedown(event.touches[0])
    },

    mousedown (e) {
      const vm = this
      const rect = vm.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      vm.isDrawing = true
      vm.startX = x
      vm.startY = y

      vm.points.push({
        x,
        y
      })
    },

    touchmove (event) {
      const vm = this
      vm.mousemove(event.touches[0]); event.preventDefault()
    },

    mousemove (e) {
      const vm = this
      const rect = vm.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (vm.isDrawing) {
        vm.context.beginPath()
        vm.context.moveTo(vm.startX, vm.startY)
        vm.context.lineTo(x, y)
        vm.context.lineWidth = 2
        vm.context.lineCap = 'round'
        vm.context.strokeStyle = 'rgba(0,0,255,1)'
        vm.context.stroke()

        vm.startX = x
        vm.startY = y

        vm.points.push({
          x,
          y
        })
      }
    },

    touchend (event) {
      const vm = this
      vm.mouseup(event.changedTouches[0])
    },

    mouseup (e) {
      const vm = this
      vm.isDrawing = false
      if (vm.points.length > 0) {
        localStorage.points = JSON.stringify(vm.points)
      }
    },

    resetCanvas () {
      const vm = this
      const cwidth = vm.canvas.width
      vm.canvas.width = cwidth

      vm.points.length = 0 // reset points array
    },

    resetClicked () {
      if (this.showcanvas) {
        this.resetCanvas()
      } else {
        this.$axios
          .post('/fileupload/delsign', { filenm: this.guestdata.signfile })
          .then((response) => {
            //            const fullfilepath = response.data.filenm
            this.guestdata.signfile = ''
            this.signImg = ''
          })
          .catch((error) => {
            alert(error.message)
          })
        this.showcanvas = true
      }
    },

    saveImage () {
      const vm = this
      const dataURL = vm.canvas.toDataURL('image/png')

      this.$axios
        .post('/fileupload/sign', { img: dataURL })
        .then((response) => {
          const fullfilepath = response.data.filenm
          const filename = fullfilepath.replace(/^.*[\\/]/, '')

          this.guestdata.signfile = filename
          this.signImg = 'http://192.168.0.102:3001/' + filename
          // this.$store.commit('guestinfo/SET_SUBGUESTINFO', { id: this.$route.params.id, data: { signfile: fullfilepath } })
        })
        .catch((error) => {
          alert(error.message)
        })
      this.showcanvas = false
    }
  }
}

</script>
