/*
// const cookieparser = require('cookieparser')
import Cookie from 'js-cookie'

export default function (context) {
  // If the user is not authenticated
  console.log('autheticating the page')
  if (!context.store.state.auth) {
    const authToken = Cookie.get('auth')
    if (!authToken) {
      return context.redirect('/login')
    } else {
      context.store.commit('updateAuth', authToken)
      return context.$axios.$post('/users/datafromAuthT', { Token: authToken })
        .then((res) => {
          console.log(res.data.result)
          context.store.commit('set_user', res.data.result)
        })
    }
  } else {
  }
}
*/

export default function (context) {
  // If the user is not authenticated
  if (!context.store.state.auth) {
    return context.redirect('/login')
  } else {
    return true
    // do nothing
  }
}
