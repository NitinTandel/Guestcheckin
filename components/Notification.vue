<template>
  <v-snackbar v-model="showbar" :timeout="2000">
    {{ message }}
    <v-btn
      class="mx-2"
      fab
      dark
      small
      color="primary"
      @click="showbar = false"
    >
      <v-icon dark>
        mdi-close
      </v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Notification',

  props: {
    message: {
      type: String,
      required: true
    }
    //    showmsg: {
    //      type: Boolean,
    //      required: true
    //    }
  },
  data () {
    return {
      showbar: true
    }
  }

}
</script>
