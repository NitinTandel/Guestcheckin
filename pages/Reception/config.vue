<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="configdata.co_name"
      :counter="25"
      :rules="nameRules"
      label="Hotel Name"
      outlined
      dense
      required
    />

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
      <v-tab-item key="Checkin">
        <v-card dark elevation="4" height="330">
          <v-card-text>
            <v-select
              v-model="configdata.gcInt"
              :items="IntOptions"
              :rules="[v => !!v || 'Product option is required']"
              label="Integration with"
              dense
              required
              outlined
            />

            <v-text-field
              v-model="configdata.uploadfolder"
              :rules="folderRules"
              label="Document storage Folder"
              outlined
              required
              dense
            />

            <v-text-field
              v-model="configdata.gcdbffolder"
              :rules="folderRules"
              label="DBF files Folder"
              outlined
              required
              dense
            />

            <v-autocomplete
              v-model="configdata.country"
              :items="countrylist"
              :filter="countryFilter"
              color="white"
              item-text="Name"
              label="Local Country"
              outlined
              dense
            />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item key="Menu">
        <v-card dark elevation="4" height="330">
          <v-card-text>
            <v-select
              v-model="configdata.menuInt"
              :items="IntOptions"
              :rules="[v => !!v || 'Product option is required']"
              label="Integration with"
              required
              outlined
            />

            <v-text-field
              v-model="configdata.menuDBFFoler"
              :rules="folderRules"
              label="DBF files Folder"
              outlined
              required
              dense
            />

            <v-text-field
              v-model="configdata.menuImgFolder"
              :rules="folderRules"
              label="Menu Images Folder"
              outlined
              required
              dense
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-spacer>
      <v-btn
        color="success"
        class="mr-4"
        @click="saveChanges()"
      >
        Save
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="cancelChanges()"
      >
        Cancel
      </v-btn>
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
    </v-spacer>
  </v-form>
</template>

<script>

export default {
  auth: true,

  data: () => ({
    tab: null,
    tabs: [
      'Checkin Config', 'Menu config'
    ],
    countrylist: [],

    msgbar: false,
    msgText: '',

    configdata: {
      co_id: 1,
      co_name: '',
      country: '',
      gcInt: '',
      uploadfolder: '',
      gcdbffolder: '',
      menuInt: '',
      menuImgFolder: '',
      menuDBFFoler: ''
    },

    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 30) || 'Name must be less than 30 characters'
    ],

    folderRules: [
      v => !!v || 'Folder Name is required',
      v => (v && v.length <= 100) || 'Folder Name must be less than 100 characters'
    ],

    select: null,
    IntOptions: [
      'Hotsys - DOS',
      'Hotsys - Windows'
    ]

  }),

  created () {
    this.initialize()
  },

  methods: {

    async initialize () {
      try {
        const apidata = await this.$axios.get('/company/config')
        this.configdata = apidata.data

        const apidata1 = await this.$axios.get('/checkin/countries')
        this.countrylist = apidata1.data
      } catch (error) {
        this.msgText = error.message
      };
    },

    async saveChanges () {
      const response = await this.$axios.post('/company/updatecfg', this.configdata)
      this.$store.commit('guestinfo/SET_HOTELDATA', {
        co_name: this.configdata.co_name,
        country: this.configdata.country,
        Nationality: this.configdata.Nationality
      })
      //      console.log(response)
      this.msgbar = true
      this.msgText = response

      this.$router.push('/Reception')
    },
    cancelChanges () {
      this.msgbar = true
      this.msgText = 'Canceled. Changes to data not saved'

      this.$router.push('/Reception')
    },

    countryFilter (item, queryText, itemText) {
      const textOne = item.Name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
