// import { axios } from '~/nuxt.config'

export const state = () => ({
  mnuCatData: [],
  menuData: [],
  cart: [],
  CartTotals: {
    selectedMeal: '',
    selectedShift: '',
    selectedLocCode: '',
    selectedLocName: '',
    selectedTable: '',
    Qty: 0,
    Amt: 0
  }

})

export const mutations = {
  SET_MENU_CAT (state, data) {
    state.mnuCatData = data
    state.mnuCatData.push({ LOCATIONCODE: 'ALL', CATEGORYCODE: '0', CATEGORYNAME: 'All' })
    state.mnuCatData.sort(function (a, b) {
      return a.LOCATIONCODE - b.LOCATIONCODE
    })
  },

  SET_MENU_DATA (state, Data) {
    state.menuData = Data
  },

  ADD_TO_CART (state, Data) {
    for (let i = 0; i < Data.length; i++) {
      state.cart.push(Data[i])
    }
  }

}

export const actions = {
  fetchMenuCat (context) {
    this.$axios.get('/dbfapi/menucat').then(
      (response) => {
        context.commit('SET_MENU_CAT', response.data.data)
      })
  },

  fetchMenuData (context) {
    this.$axios.get('/dbfapi/menulist').then(
      (response) => {
        context.commit('SET_MENU_DATA', response.data.data)
      })
  }

}

export const getters = {
//  baseStepNo: state => state.baseStepNo
}
