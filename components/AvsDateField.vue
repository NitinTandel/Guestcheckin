<template>
  <v-container class="pa-0 ma-0">
    <v-menu
      v-model="fromDateMenu"

      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          ref="selectedDate"
          v-model="fromDateDisp"
          hint="DD/MM/YYYY format"
          :label="label"
          dense
          outlined
          prepend-icon="mdi-event"
          v-on="on"
          @input="updateDate($event)"
        />
      </template>
      <v-date-picker
        v-model="actualDate"
        color="green lighten-1"
        header-color="primary"
        locale="en-in"
        no-title
        :min="minDate"
        @input="updateDate($event)"
      />
    </v-menu>
  </v-container>
</template>

<script>
export default {
  // Input date as YYYY-MM-DD format
  props: {
    datestr: {
      type: String,
      required: true
    },

    label: {
      type: String,
      required: true
    }

  },

  data: () => ({
    fromDateMenu: false,
    //     fromDateVal: "2020-05-15",
    minDate: '1900-01-05',
    maxDate: '2019-08-30',
    formatatedDate: '',
    actualDate: ''
  }),

  computed: {
    fromDateDisp () {
      const splitValueString = this.actualDate.split('-')

      const formatatedDate = splitValueString[2] + '/' + splitValueString[1] + '/' + splitValueString[0]
      return formatatedDate
    }
  },

  created () {
    this.actualDate = this.datestr
  },

  methods: {
    updateDate (event) {
      this.fromDateMenu = false

      //      const splitValueStr = this.$refs.selectedDate.value.split('/')
      //      const YYYYMMDDDate = splitValueStr[2] + '-' + splitValueStr[1] + '-' + splitValueStr[0]

      //      this.$emit('onDateUpdate', YYYYMMDDDate)

      this.$emit('onDateUpdate', this.actualDate)
    }
  }

}
</script>
