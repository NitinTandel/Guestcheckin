<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Hotsys Ver 1.0
          </v-list-item-title>
          <v-list-item-subtitle>
            Guest check-in
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app dark class="indigo">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $store.state.guestinfo.HotelName }}</v-toolbar-title>
      <v-spacer />

      <div v-if="$auth.loggedIn">
        <div class="text-center">
          <v-btn icon to="/Reception" @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-home</v-icon>
          </v-btn>

          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                dark
                v-on="on"
              >
                {{ $auth.user.userid }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in LoginItems"
                :key="index"
                @click="menuClicked(index)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <div v-else>
        <v-btn icon to="/" @click.stop="rightDrawer = !rightDrawer">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer fixed app dark class="indigo">
      <span>&copy; 2020  HotByte</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'About',
          to: '/About'
        }
      ],
      LoginItems: [
        { title: 'My Profile' },
        { title: 'Logout' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false
      //      title: this.$store.state.guestinfo.HotelName
    }
  },
  beforeCreate () {
    this.$store.dispatch('guestinfo/fetchHotelName')
  },
  methods: {
    menuClicked (currentIndex) {
      if (currentIndex === 1) {
        this.$auth.logout()
        this.$router.push('/Reception')
      } else {
        alert('menu' + currentIndex + 'clicked')
      }
    }
  }
}
</script>
