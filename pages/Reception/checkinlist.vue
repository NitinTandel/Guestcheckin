<template>
  <div id="checkinList">
    <v-card tile>
      <v-breadcrumbs :items="bc">
        <template v-slot:divider>
          <v-icon>mdi-forward</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>

    <v-container class="my-5">
      <v-layout align-center justify-center>
        <v-data-table dense :headers="headers" :items="guestsdata" :search="search" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat color="blue">
              <v-toolbar-title>Check-ins to be verified</v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer />
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
              <v-spacer />
              <v-btn color="primary" dark class="mb-2" @click="addNewCheckin()">
                New Item
              </v-btn>
              <!-- dialog -->
              <v-dialog v-model="dialogpic" scrollable height="500" width="800">
                <v-container>
                  <v-toolbar flat dark color="primary" dense>
                    <v-toolbar-title>View Attachment</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon dark @click="dialogpic = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-img
                    height="480"
                    width="800"
                    :src="dialogimg"
                    style="background-color:white;"
                  />
                </v-container>
              </v-dialog>
              <v-dialog v-model="dialog" persistent scrollable transition="dialog-bottom-transition" max-width="800px">
                <!--                <v-card color="#1F7087" dark> -->
                <v-card class="overflow-hidden" color="purple lighten-1" dark>
                  <v-toolbar
                    flat
                    color="purple"
                    dense
                  >
                    <v-icon>mdi-account</v-icon>
                    <v-toolbar-title class="font-weight-light">
                      Modify Check-in Data
                    </v-toolbar-title>
                    <v-spacer />
                    <v-btn
                      color="purple darken-3"
                      fab
                      small
                      @click="dialog = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <!--
                  <v-card-title>
                    <v-toolbar flat dark color="pink darken-2" dense height="40px">
                      <v-toolbar-title>Modify Check-in Data</v-toolbar-title>
                      <v-spacer />
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                  </v-card-title>
 -->
                  <v-card-text>
                    <v-container>
                      <v-row dense>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field v-model="editedItem.checkin_id" label="ID" outlined disabled dense />
                        </v-col>
                        <v-col cols="12" sm="4" md="2">
                          <v-text-field v-model="editedItem.Guest_num" label="Guest No" outlined disabled dense />
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <avs-date-field :datestr="editedItem.Date" label="Checkin Date" @onDateUpdate="updateDate" />
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field v-model="checkinTime" type="time" label="Checkin Time" outlined dense />
                          <!--                          <avs-time-field :timestr="editedItem.Time" label="Checkin Time" @onTimeUpdate="updateTime" /> -->
                        </v-col>
                        <v-tabs
                          v-model="tab"
                          color="basil"
                          background-color="primary"
                          dark
                          dense
                          height="40px"
                        >
                          <v-tab v-for="stab in tabs" :key="stab">
                            {{ stab }}
                          </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="tab">
                          <v-tab-item key="Guest Name">
                            <v-card color="#1F7087" flat width="800px" elevation="4" class="mx-auto">
                              <v-card-text>
                                <v-container>
                                  <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field v-model="editedItem.name" label="Guest Name" outlined dense />
                                      <v-text-field v-model="editedItem.mobile_no" label="Guest mobile" outlined dense />
                                      <v-text-field v-model="editedItem.email" label="Guest E-mail" outlined dense />
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-select
                                        v-model="editedItem.nationality_type"
                                        :items="ResidanceTypes"
                                        label="Residance"
                                        outlined
                                        dense
                                      />
                                      <!--                                      <v-text-field v-model="editedItem.nationality_type" label="Local/Foreigner" outlined dense /> -->
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item key="Address">
                            <v-card color="#1F7087" flat width="800px" elevation="4" class="mx-auto">
                              <v-card-text>
                                <v-container>
                                  <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field v-model="editedItem.address1" label="Address Line 1" outlined dense />
                                      <v-text-field v-model="editedItem.address2" label="Address Line 2" outlined dense />
                                      <v-text-field v-model="editedItem.address3" label="Address Line 3" outlined dense />
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="editedItem.city" label="City" outlined dense />
                                      <!--                                      <v-text-field v-model="editedItem.country" label="Country" outlined dense /> -->
                                      <v-autocomplete
                                        v-model="editedItem.country"
                                        :items="countrylist"
                                        :filter="countryFilter"
                                        color="white"
                                        item-text="Name"
                                        label="Country"
                                        dense
                                        outlined
                                      />
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="editedItem.state" label="State" outlined dense />
                                      <v-text-field v-model="editedItem.pin" label="PIN" outlined dense />
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item key="Documents">
                            <v-card color="#1F7087" flat width="800px" elevation="4">
                              <v-card-text>
                                <v-container>
                                  <v-row dense>
                                    <v-col cols="12" sm="6" md="6">
                                      <!--                                      <v-text-field v-model="editedItem.proof1_type" label="Document Type" outlined dense /> -->
                                      <v-select
                                        v-model="editedItem.proof1_type"
                                        :items="idTypes"
                                        label="Document Type"
                                        outlined
                                        dense
                                      />
                                      <v-btn color="primary" @click="openAttachmentpic(editedItem.proof1_filepath)">
                                        {{ 'View ' + (editedItem.proof1_type ==='' ? 'Attachment' : editedItem.proof1_type) }}
                                      </v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="editedItem.proof1_Number" :label="editedItem.proof1_type +' Number'" outlined dense />
                                      <v-file-input v-model="lProof1File" small-chips label="upload file" @change="onAddProof1Files()" />
                                    </v-col>
                                    <v-divider />
                                    <v-col cols="12" sm="6" md="6">
                                      <!--                                      <v-text-field v-model="editedItem.proof2_type" label="Document Type" outlined dense /> -->
                                      <v-select
                                        v-model="editedItem.proof2_type"
                                        :items="idTypes"
                                        label="Document Type"
                                        outlined
                                        dense
                                      />
                                      <v-btn color="primary" @click="openAttachmentpic(editedItem.proof2_filepath)">
                                        {{ 'View ' + (editedItem.proof2_type ==='' ? 'Attachment' : editedItem.proof2_type) }}
                                      </v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-text-field v-model="editedItem.proof2_Number" :label="editedItem.proof2_type +' Number'" outlined dense />
                                      <v-file-input v-model="lProof2File" small-chips label="upload file" @change="onAddProof1Files()" />
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field v-model="editedItem.NATIONALITY" label="Nationality" outlined dense />
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                          <v-tab-item key="Verification">
                            <v-card color="#1F7087" flat width="800px" elevation="4">
                              <v-card-text>
                                <v-container>
                                  <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field v-model="editedItem.Room_No" label="Assigned Room Number" outlined dense />
                                      <v-btn color="primary" @click="openAttachmentpic(editedItem.sign_filepath)">
                                        View Signature
                                      </v-btn>
                                      <v-file-input v-model="lProof1File" small-chips label="Upload Signature" @change="onAddProof1Files" />
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-btn color="primary" @click="printCheckin()">
                                        Print
                                      </v-btn>
                                      <v-btn color="primary" @click="submitData(editedItem)">
                                        Verify and Submit
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                        </v-tabs-items>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="success" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="success" text @click="saveData(editedItem)">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="deleteDialog" persistent scrollable max-width="500px">
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                    <span class="headline">Delete Record</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <p> {{ DeleteMessage }}</p>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deletefromData">
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-layout>

      <v-snackbar v-model="msgbar" :timeout="2000">
        {{ msgText }}
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="primary"
          @click="msgbar = false"
        >
          <v-icon dark>
            mdi-close
          </v-icon>
        </v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import AvsDateField from '~/components/AvsDateField'
// import AvsTimeField from '~/components/AvsTimeField'
import avscommon from '~/modules/avscommon'

export default {
  name: 'CheckInList',
  components: {
    AvsDateField
    //   AvsTimeField
  },

  data () {
    return {
      msgbar: false,
      msgText: '',
      bc: [{
        text: 'Home',
        disabled: false,
        href: '/Reception'
      }],

      dpmenu: false,
      checkinDtTime: null,
      checkinTime: null,
      tab: null,
      tabs: [
        'Guest Name', 'Address', 'Documents', 'Verification'
      ],
      ResidanceTypes: ['Local', 'Foreigner'],
      search: '',
      dialog: false,
      deleteDialog: false,
      DeleteMessage: '',
      headers: [
        { text: 'Id', align: 'start', value: 'checkin_id' },
        { text: 'Guest No', value: 'Guest_num' },
        { text: 'Check-in Date', value: 'Date' },
        { text: 'Check-in Time', value: 'Time' },
        { text: 'Guest Name', value: 'name' },
        { text: 'Mobile No', value: 'mobile_no' },
        { text: 'Room No', value: 'ROOM_NO' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      lProof1File: '',
      lProof2File: '',
      dialogpic: false,
      dialogimg: '',
      guestsdata: [],
      editedIndex: -1,
      deletededIndex: -1,

      editedItem: {
        checkin_id: '',
        Guest_num: '',
        Date: '',
        Time: '',
        name: '',
        mobile_no: '',
        ROOM_NO: ''
      },
      defaultItem: {
        checkin_id: '',
        Guest_num: '',
        Date: '',
        Time: '',
        name: '',
        mobile_no: '',
        ROOM_NO: ''
      },
      idTypes: [],
      countrylist: [],
      edititemDate: new Date()
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Check-in' : 'Edit Check-in'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    //    const bcdata = await this.$axios.get('/menus/menuBC/' + 'GRP_MASTER')
    //    this.bc = bcdata.data
    this.initialize()
  },

  methods: {
    async initialize () {
      try {
        const apidata = await this.$axios.get('/checkin/unverified')
        this.guestsdata = apidata.data

        const iddata = await this.$axios.get('/checkin/prooftypes')
        for (let i = 0; i < iddata.data.length; i++) {
          this.idTypes.push(iddata.data[i].Proof_type)
        }

        const apicountrydata = await this.$axios.get('/checkin/countries')
        this.countrylist = apicountrydata.data
      } catch (error) {
        this.msgText = error.message
        // console.log(error)
      };

      //      console.log(apidata.data)
    },

    printCheckin () {
      const pdfdd = {
        content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 100, '*'],

              body: [
                ['First', 'Second', 'Third', 'The last one'],
                ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
                [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
              ]
            }
          }
        ]
      }

      pdfMake.vfs = pdfFonts.pdfMake.vfs

      const win = window.open('', '_blank')
      pdfMake.createPdf(pdfdd).open({}, win)
    },

    countryFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.Name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    onAddProof1Files () {
      // upload files
    },
    openAttachmentpic (picfile) {
      if (picfile === '' || !picfile) {
        this.msgText = 'No document uploaded ! '
        this.msgbar = true
      } else {
        const filename = picfile.replace(/^.*[\\/]/, '')
        const picURL = 'http://192.168.0.102:3001/' + filename
        this.dialogimg = picURL
        this.dialogpic = true
      }
    },

    addNewCheckin () {
      this.$router.push('/')
      // console.log(this.dialog)
    },

    editItem (item) {
      // console.log('edit item')
      this.editedIndex = this.guestsdata.indexOf(item)
      this.editedItem = item
      //      const Dtparts = this.editedItem.Date.split('-')

      //      const year = Dtparts[0]
      //      const month = Dtparts[1]
      //      const day = Dtparts[2]

      this.checkinTime = this.avscommon.texttoTime(this.editedItem.Time)
      //      const ampmAry = this.editedItem.Time.split(' ')
      //      const timeAry = this.editedItem.Time.split(':')
      //      const ampm = ampmAry[1]
      //      const nhh = parseInt(timeAry[0]) + (ampm === 'PM' ? 12 : 0)
      //      const hh = nhh.toString()
      //      const mm = timeAry[1]
      //      this.checkinDtTime = new Date(year, month, day, hh, mm)

      //     this.checkinTime = hh + ':' + mm

      this.dialog = true
    },

    deleteItem (item) {
      //      console.log('delete item')
      this.deletededIndex = this.guestsdata.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.guestsdata.splice(this.deletededIndex, 1)
      //      this.editedItem = Object.assign({}, item)
      this.DeleteMessage = 'Are you sure you want to delete check for guest :' + item.name + '?'
      this.deleteDialog = true
    },

    close () {
      this.dialog = false
      this.Deletedialog = false
      //    this.$nextTick(() => {
      //      this.editedItem = Object.assign({}, this.defaultItem)
      //      this.editedIndex = -1
      //      this.deletededIndex = -1
      //      })
    },

    async deletefromData () {
      if (this.deletededIndex > -1) {
        Object.assign(this.groupsdata[this.deletededIndex], this.editedItem)
        const apidata = await this.$axios.post('/groups/delete/' + this.editedItem.GRP_CODE)
        this.msgText = apidata.data.message
        this.msgbar = true
        this.groupsdata.splice(this.deletededIndex, 1)
      }
      this.close()
    },

    async saveData (item) {
      this.editedIndex = this.guestsdata.indexOf(item)
      //  this.editedItem = item
      item.verified = 0

      item.Time = avscommon.timetoText(this.checkinTime)
      //      console.log(this.checkinTime)
      //      console.log(avscommon.timetoText(this.checkinTime))

      const apidata = await this.$axios.post('/checkin/update', item)
      this.msgText = apidata.data.message
      this.msgbar = true

      this.close()
    },

    async submitData (item) {
      this.editedIndex = this.guestsdata.indexOf(item)
      //      this.editedItem = item
      item.verified = 1
      const apidata = await this.$axios.post('/dbfapi/updateCheckin', { user: this.$auth.user.userid, data: item })

      //      console.log(apidata)
      if (!apidata.data.Error) {
        const apidata1 = await this.$axios.post('/checkin/update', item)
        this.msgText = apidata1.data.message
      } else {
        this.msgText = apidata.data.message
      }
      // this.msgText = apidata1.data.message

      this.msgbar = true

      this.close()
    },

    updateDate (newDate) {
      this.editedItem.Date = newDate
    }
    /*
    updateTime (newTime) {
      console.log(newTime)
      // this.editedItem.Time = newTime
    }
*/
  }

}
</script>
