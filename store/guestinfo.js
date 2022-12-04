// import { axios } from '~/nuxt.config'

export const state = () => ({
  HotelName: '',
  HotelCountry: '',
  LocalNationality: '',
  baseStepNo: 1,
  currentGuestId: 0,
  alldata: {
    name: '',
    mobile: '',
    noofguests: 1,
    co_name: '',
    guestlist: [{
      name: '',
      mobile: '',
      mainguest: true,
      res_type: '',
      nationality: '',
      email: '',
      add1: '',
      add2: '',
      add3: '',
      add4: '',
      city: '',
      state: '',
      country: '',
      pin: '',
      proof1type: '',
      proof2type: '',
      proof1id: '',
      proof2id: '',
      uploadfile1: '',
      serverfile1: '',
      uploadfile2: '',
      serverfile2: '',
      signfile: '',
      hotbyteBookingRef: '',
      OtherBookingRef: '',
      bookingDate: '',
      remark: '',
      RoomNo: '',
      dataDone: false
    }]
  }
})

export const mutations = {
  SET_HOTELDATA (state, coData) {
    state.HotelName = coData.co_name
    state.HotelCountry = coData.country
    state.LocalNationality = coData.Nationality
  },

  SET_STEPNO (state, stepno) {
    state.baseStepNo = stepno
  },

  SET_CURRENTGUEST (state, guestno) {
    state.currentGuestId = guestno
  },

  // To Assign single object
  SET_BASEINFO (state, payload) {
    state.alldata = Object.assign({}, state.alldata, payload)
    state.alldata.guestlist[0] = Object.assign({}, state.alldata.guestlist[0], payload)
  },

  addGuest (state, newGuest) {
    state.alldata.noofguests++
    state.alldata.guestlist.push(newGuest)
  },

  removeGuest (state) {
    state.alldata.noofguests--
    state.alldata.guestlist.pop()
  },

  updatbaseinfo (state, payload) {
    state.alldata.name = payload.name
    state.alldata.mobile = payload.mobile
    state.alldata.noofguests = payload.noofguests
  },

  // To Assign single guest obect object
  SET_SUBGUESTINFO (state, payload) {
    state.alldata.guestlist[payload.id] = Object.assign({}, state.alldata.guestlist[payload.id], payload.data)
  },

  SET_COPYADDRESS (state, payload) {
    state.alldata.guestlist[payload.id].add1 = state.alldata.guestlist[0].add1
    state.alldata.guestlist[payload.id].add2 = state.alldata.guestlist[0].add2
    state.alldata.guestlist[payload.id].add3 = state.alldata.guestlist[0].add3
    state.alldata.guestlist[payload.id].add4 = state.alldata.guestlist[0].add4

    state.alldata.guestlist[payload.id].city = state.alldata.guestlist[0].city
    state.alldata.guestlist[payload.id].state = state.alldata.guestlist[0].state
    state.alldata.guestlist[payload.id].country = state.alldata.guestlist[0].country
    state.alldata.guestlist[payload.id].pin = state.alldata.guestlist[0].pin
  },

  SET_GUESTFROMBOOKING (state, bookingdata) {

  },

  SET_GUESTFROMHISTORY (state, historydata) {

  }

}

export const actions = {
  fetchHotelName (context) {
    this.$axios.get('/company/listall').then(
      (response) => {
        context.commit('SET_HOTELDATA', response.data)
      })
  }

}

export const getters = {
  baseStepNo: state => state.baseStepNo
}
