<template>
  <div id="AppMenu">
    <v-card tile>
      <v-breadcrumbs :items="bc">
        <template v-slot:divider>
          <v-icon>mdi-forward</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>
    <!--    <h1> {{ currentMenu }}</h1> -->
    <v-layout text-xs-center row wrap>
      <v-flex
        v-for="menu in userMenus"
        :key="menu.id"
        xs12
        sm6
        sm4
        lg3
      >
        <menu-tile
          :menu-id="menu.id"
          :menu-level="menu.level"
          :menu-title="menu.name"
          :menu-detail="menu.description"
          :img-file="menu.ImageFileName"
          :nav-to="menu.navigate_to"
          @onClickTile="menuAction"
        />
        <!--
          <div v-if="$store.state.auth.isErr">
            {{ errorMessage }}
          </div>
          -->
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import MenuTile from '~/components/TmpltMenuTile.vue'

export default {
//  middleware: 'notAuthenticated',
  components: {
    MenuTile
  },

  data () {
    return {
      currentMenu: '0',
      loading: false,
      alert: null,
      errorMessage: null,
      menuid: '0',
      userMenus: [
        { id: '1', level: 0, name: 'Check-ins', description: 'Verfiy/update check-ins', ImageFileName: 'TansData.png', navigate_to: '/Reception/checkinlist' },
        { id: '2', level: 0, name: 'Config', description: 'Update Configuratios', ImageFileName: 'ConfigMenu.png', navigate_to: '/Reception/config' },
        { id: '3', level: 0, name: 'Users', description: 'Add/Update users', ImageFileName: 'users.png', navigate_to: '/Reception/users' }
      ],

      bc: [{
        text: 'Home',
        disabled: false,
        href: '/'
      }]
    }
  },
  methods: {
    menuAction (selectedMenu) {
      if (selectedMenu.navTo === 'MENU') {
        this.$router.push('/menus/' + selectedMenu.Id)
      } else {
        this.$router.push(selectedMenu.navTo)
      }
    }

  }

}
</script>
