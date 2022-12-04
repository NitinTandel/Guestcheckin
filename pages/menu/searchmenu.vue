<template>
  <div id="menuSearch">
    <table border="0" style="width:100%">
      <tbody>
        <tr>
          <td style="width:70%; vertical-align: middle;">
            <v-autocomplete
              v-model="selectedCategory"
              :items="categorylist"
              :filter="categoryFilter"
              color="white"
              item-text="CATEGORYNAME"
              label="Category"
              dense
              outlined
              hide-details
            />
          </td>
          <td style="width:30%; vertical-align: middle;">
            <v-switch v-model="isVegOnly" label="Veg." dense />
          </td>
        </tr>
        <tr>
          <td colspan="2" style="width:100%; vertical-align: middle;">
            <v-text-field
              v-model="searchQuery"
              class="pa-1"
              label="Search for.."
              hide-details
              outlined
              dense
            />
          </td>
        </tr>
        <tr>
          <td colspan="2" style="width:100%; vertical-align: middle;">
            <v-virtual-scroll
              :items="filteredMenus"
              :item-height="50"
              height="250"
            >
              <template v-slot="{ item }">
                <v-list-item>
                  <v-list-item-avatar tile>
                    <v-img :src="'http://192.168.0.102:3001' + item.img" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.MENUITEMNAME }}</v-list-item-title>
                    <v-list-item-subtitle>Rate : {{ item.RATE }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox v-model="item.selected" class="mx-2" />
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </td>
        </tr>
        <tr>
          <td colspan="2" align="right" style="width:100%;">
            <v-btn
              color="white--text orange darken-4"
              @click="clickAddtoCart"
            >
              Select Items
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  auth: false,

  data () {
    return {
      searchQuery: '',
      selectedCategory: 'All',
      TotalSelectedItems: 0,
      isVegOnly: false,
      //   categorylist: ['Category1', 'Snacks', 'Lunch', 'Biryani'],
      //   menuList: []
      categorylist: JSON.parse(JSON.stringify(this.$store.state.menu.mnuCatData)),
      menuList: JSON.parse(JSON.stringify(this.$store.state.menu.menuData))
    }
  },

  computed: {
    filteredMenus () {
      //      if (this.menuList.length == 0) {
      //        this.menuList = this.menuData.filter(menu => menu.LOCATIONCODE.match(this.CartTotals.selectedLocCode))
      //      }

      //      const VegVal = this.isVegOnly ? 'Y' : 'N'
      let fltr1 = []
      let fltr2 = []
      let fltr3 = []

      if (this.isVegOnly) {
        fltr1 = this.menuList.filter(menu => menu.VEGITEM === this.isVegOnly)
      } else {
        fltr1 = this.menuList
      }

      if (this.selectedCategory.toLowerCase() !== 'all') {
        fltr2 = fltr1.filter(menu => menu.CATEGORYNAME.toLowerCase().includes(this.selectedCategory.toLowerCase()))
      } else {
        fltr2 = fltr1
      }

      if (this.searchQuery !== '') {
        fltr3 = fltr2.filter(menu => menu.MENUITEMNAME.toLowerCase().includes(this.searchQuery.toLowerCase()))
      } else {
        fltr3 = fltr2
      }
      return fltr3
    }

  },

  methods: {
    genRandomIndex (length) {
      return Math.ceil(Math.random() * (length - 1))
    },

    categoryFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.CATEGORYNAME.toLowerCase()
      const textTwo = item.CATEGORYCODE.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },

    clickAddtoCart () {
      const selItems = []
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].selected) {
          this.menuList[i].QTY++
          selItems.push(this.menuList[i])
        }
      }
      //      console.log(selItems)
      this.$store.commit('menu/ADD_TO_CART', selItems)
      this.$router.push('/menu/myorder')
    }

  }
}
</script>
