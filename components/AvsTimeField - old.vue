
<template>
  <v-container class="pa-0 ma-0">
    <v-menu
      ref="menu"
      v-model="menu2"
      :close-on-content-click="false"
      :nudge-right="40"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="fromTimeDisp"
          :label="label"
          prepend-icon="mdi-access_time"
          readonly
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <v-time-picker
        v-if="menu2"
        v-model="time"
        full-width
        @click:minute="updateTime($event)"
      />
    </v-menu>
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
    time: null,
    menu2: false,
    modal2: false,
    formTime: ''
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
