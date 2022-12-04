<template>
  <v-card class="mx-auto" max-width="400" max-height="10">
    <v-card-title class="white--text orange darken-4">
      My Order
      <v-spacer />
      <v-btn
        fab
        dark
        small
        color="indigo"
        @click="openSearchPage"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-title>
    <!--    <v-card-text class="pt-4">-->
    <v-divider />
    <table style="width:100%">
      <tbody>
        <tr>
          <td style="width:70%; vertical-align: middle;">
            <v-virtual-scroll
              :items="selmenuitems"
              :item-height="50"
              height="250"
            >
              <template v-slot="{ item }">
                <v-list-item>
                  <!--
          <v-list-item-avatar tile>
            <v-img :src="item.img" />
          </v-list-item-avatar>
-->
                  <v-list-item-content>
                    <v-list-item-title>{{ item.MENUITEMNAME }}</v-list-item-title>
                    <v-list-item-subtitle> Qty : {{ item.QTY }} for Rate : {{ item.RATE }} each</v-list-item-subtitle>
                    <!--            <v-list-item-subtitle>Qty : {{ item.QTY }}</v-list-item-subtitle> -->
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      small
                      fab
                    >
                      <v-icon
                        color="orange darken-4"
                        @click="addQty(item)"
                      >
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>

                  <v-list-item-action>
                    <v-btn
                      small
                      fab
                    >
                      <v-icon
                        color="orange darken-4"
                        @click="reduceQty(item)"
                      >
                        mdi-minus
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </td>
        </tr>
        <tr style="outline: thin solid">
          <td align="right">
            <v-list-item-subtitle> Total Qty : {{ TotalQty }} Total Amount : {{ TotalAmt }} </v-list-item-subtitle>
          </td>
        </tr>
      </tbody>
    </table>
    <!--    </v-card-text> -->
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="openSearchPage"
      >
        Add more items
      </v-btn>
      <v-btn
        color="white--text orange darken-4"
        disabled
        @click="callnextPage"
      >
        Submit Order
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  auth: false,

  data () {
    return {
      vegOnly: false,
      mnuCategory: '',
      categorylist: ['Category1', 'Snacks', 'Lunch', 'Biryani'],
      selmenuitems: JSON.parse(JSON.stringify(this.$store.state.menu.cart))
      //      TotalQty: 0,
      //      TotalAmt: 0
    }
  },

  computed: {
    TotalQty () {
      let rtnVal = 0
      if (this.selmenuitems.length > 0) {
        for (let i = 0; i < this.selmenuitems.length; i++) {
          rtnVal = rtnVal + this.selmenuitems[i].QTY
        }
      }
      return rtnVal
    },

    TotalAmt () {
      let rtnVal = 0
      if (this.selmenuitems.length > 0) {
        for (let i = 0; i < this.selmenuitems.length; i++) {
          rtnVal = rtnVal + (this.selmenuitems[i].QTY * this.selmenuitems[i].RATE)
        }
      }
      return rtnVal
    }

  },
  methods: {
    genRandomIndex (length) {
      return Math.ceil(Math.random() * (length - 1))
    },

    categoryFilter (item, queryText, itemText) {
      //      item = item.filter(country => item.country === this.guestdata.country)
      const textOne = item.Name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) ||
          textTwo.includes(searchText)
    },
    callnextPage () {
      this.$router.push('/menu/finish')
    },
    openSearchPage () {
      this.$router.push('/menu/searchmenu')
    },
    addQty (item) {
      const editedIndex = this.selmenuitems.indexOf(item)
      this.selmenuitems[editedIndex].QTY++
    },
    reduceQty (item) {
      const editedIndex = this.selmenuitems.indexOf(item)
      if (this.selmenuitems[editedIndex].QTY > 0) {
        this.selmenuitems[editedIndex].QTY--
      }
    }

  }
}
</script>
