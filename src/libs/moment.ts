import * as moment from 'moment-timezone'

export const getMoment = (timezone: string = 'Asia/Tokyo') => {
  moment.tz(timezone)
  return moment
}