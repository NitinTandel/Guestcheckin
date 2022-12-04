<template>
  <v-layout>
    <v-flex class="text-center">
      <img
        src="/success.gif"
        alt="Vuetify.js"
        class="mb-5"
        height="70%"
        width="100%"
      >
      <blockquote class="blockquote">
        &#8220;You have successfully completed your checking Process.&#8221;
        <v-btn color="primary" @click="closeApp()">
          Close
        </v-btn>
      </blockquote>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  auth: false,

  methods: {
    closeApp () {
      // close()
      window.close()
    }

  }
}
</script>
