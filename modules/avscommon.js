
const avscommon = {
  timetoText: function timetoText (tmTime) {
    const timeSplit = tmTime.split(':')
    let hours
    let meridian
    hours = timeSplit[0]
    const minutes = timeSplit[1]

    if (hours > 12) {
      meridian = 'PM'
      hours -= 12
    } else if (hours < 12) {
      meridian = 'AM'
      if (hours === 0) {
        hours = 12
      }
    } else {
      meridian = 'PM'
    }
    const rtnVal = hours + ':' + minutes + ' ' + meridian
    return rtnVal
  },

  texttoTime: function texttoTime (stTime) {
    const ampmAry = stTime.split(' ')
    const timeAry = stTime.split(':')
    const ampm = ampmAry[1]
    const nhh = parseInt(timeAry[0]) + (ampm === 'PM' ? 12 : 0)
    const hh = nhh.toString()
    const mm = timeAry[1]

    const rtnTime = hh + ':' + mm

    return rtnTime
  }
}

export default avscommon
