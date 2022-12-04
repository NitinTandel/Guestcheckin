<template>
  <v-banner single-line>
    <div v-if="!completed">
      <v-icon slot="icon" color="warning" size="24">
        mdi-account-edit
      </v-icon>
      {{ (guestName.length == 0 ? "Guest " + (guestindex+1) : guestName.substring(0, 15) + ((guestName.length > 15) ? "..." : "") ) }}
    </div>
    <div v-else>
      <v-icon slot="icon" color="primary" size="24">
        mdi-account-check
      </v-icon>
      {{ (guestName.length == 0 ? "Guest " + (guestindex+1) : guestName.substring(0, 15) + ((guestName.length > 15) ? "..." : "") ) }}
    </div>
    <template v-slot:actions>
      <v-btn
        color="primary"
        small
        @click="btnClicked()"
      >
        Details
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
export default {
  name: 'Guestitem',

  props: {
    guestindex: {
      type: Number,
      required: true
    },
    guestName: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    btnClicked (event) {
      this.$emit('guestdetailsClicked', this.guestindex)
    }
  }

}
</script>
