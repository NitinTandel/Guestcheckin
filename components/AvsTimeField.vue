
<template>
  <v-container class="pa-0 ma-0">
    <v-select
      v-model="hr"
      :items="hrsList"
      filled
      dense
      solo
      width="10px"
    />
    <v-select v-model="min" :items="minList" filled dense />
    <v-select v-model="ampm" :items="ampmList" filled dense />
  </v-container>
</template>

<script>
export default {
  // 24 Hr Time in HH:MM format
  props: {
    timestr: {
      type: String,
      required: true
    },

    label: {
      type: String,
      required: true
    }
  },

  data: () => ({

    hrsList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    minList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    ampmList: ['AM', 'PM'],

    hr: '',
    min: '',
    ampm: ''

  }),

  computed: {
    fromTimeDisp () {
      const timeSplit = this.actualTime.split(':')
      let hours = timeSplit[0]
      const minutes = timeSplit[1]
      let meridian = timeSplit[3]

      if (hours > 12) {
        meridian = 'PM'
        hours -= 12
      } else if (hours < 12) {
        meridian = 'AM'
        if (hours === 0) {
          hours = 12
        }
      } else {
        meridian = 'PM'
      }

      const formatatedTime = hours + ':' + minutes + ' ' + meridian

      return formatatedTime
    }
  },

  created () {
    this.actualTime = this.timestr
  },

  methods: {
    updateTime (event) {
      this.$refs.menu.save(this.fromTimeDisp)

      this.$emit('onTimeUpdate', this.actualTime)
    }
  }

}
</script>
