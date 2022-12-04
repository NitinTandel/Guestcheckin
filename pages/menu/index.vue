<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-card-title class="white--text orange darken-4 ">
      Welcome to Restorent service
    </v-card-title>

    <v-card-text class="pt-4">
      <v-text-field v-model="roomNo" label="Room Number" dense outlined />

      <v-btn color="primary" @click="callnextpage()">
        Continue
      </v-btn>
    </v-card-text>

    <v-divider />
  </v-card>
</template>

<script>
export default {
  auth: false,

  data: () => ({
    roomNo: ''

  }),
  created () {
    // update the store
    this.$store.dispatch('menu/fetchMenuCat')
    this.$store.dispatch('menu/fetchMenuData')
  },

  methods: {
    callnextpage () {
      this.$router.push('/menu/myorder')
    }

  }

}
</script>
