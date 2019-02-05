import { getMoment } from '../libs/moment'
class NewNotification {
  private pushNotification: string
  private contents: []
  private triggerType: string
  private payload : {}
  private moment: any
  private timeZoneId: string | undefined
  private locale: string| undefined
  private createdTime: any
  private scheduledTime: string | undefined
  constructor (locale = 'ja-JP') {
    this.setLocationData(locale)
    this.pushNotification = 'DISABLED'
    this.contents = []
    this.triggerType = ''
    this.payload = {}
    this.moment = getMoment()
    this.setCreatedTime()
  }
  setLocationData (locale: string) {
    this.setLocale(locale)
    // 西宮で使うのだから、どの言語だろうとこのタイムゾーンでしょ
    this.setTimezoneId('Asia/Tokyo')
  }
  setTimezoneId (timezone: string) {
    this.timeZoneId = timezone
  }
  setLocale (locale: string) {
    this.validateLocale(locale)
    this.locale = locale
  }
  setContents (contents: any) {
    this.contents = contents
  }
  setCreatedTime (time = this.moment()) {
    if (!this.moment.isMoment(time) || !time.isValid()) throw new Error('Invalid created time format')
    // this.createdTime = time.toISOString()
    this.createdTime = `${time.format('YYYY-MM-DD')}T${time.format('kk:mm:ss')}.000`
  }
  setScheduledTime (time = this.moment()) {
    if (!this.moment.isMoment(time) || !time.isValid()) throw new Error('Invalid scheduled time format')
    // this.scheduledTime = time.toISOString()
    this.scheduledTime = `${time.format('YYYY-MM-DD')}T07:00:00.000`
  }
  enablePushNotification () {
    this.pushNotification = 'ENABLED'
  }
  disablePushNotification () {
    this.pushNotification = 'DISABLED'
  }
  validateLocale (locale: string) {
    switch (locale) {
      case 'ja-JP':
      case 'en-US':
        return true
      default:
        throw new Error('Unsupported locale')
    }
  }
  validateTriggerType (type: string) {
    if (!type) throw new Error('trigger type is required')
    switch (type) {
      case 'SCHEDULED_RELATIVE':
      case 'SCHEDULED_ABSOLUTE':
        return true
      default:
        throw new Error('Unsupported trigger type')
    }
  }
  setTriggerType (type: string) {
    this.validateTriggerType(type)
    this.triggerType = type
  }
  getTriggerType () {
    if (!this.triggerType) throw new Error('trigger type is undefined')
    return this.triggerType
  }
  getTimezoneID () {
    return this.timeZoneId
  }
  getLocale () {
    return this.locale
  }
  getPushNotificationStatus () {
    return this.pushNotification
  }
  getCreatedTime () {
    return this.createdTime
  }
  getScheduledTime () {
    if (!this.scheduledTime) throw new Error('scheduled time is undefined')
    return this.scheduledTime
  }
  getContents () {
    return this.contents
  }
  generatePayload () {
    this.payload = {
      createdTime: this.getCreatedTime(),
      trigger: {
        type: this.getTriggerType(),
        scheduledTime: this.getScheduledTime(),
        timeZoneId: this.getTimezoneID()
      },
      alertInfo: {
        spokenInfo: {
          content: this.getContents()
        }
      },
      pushNotification: {
        status: this.getPushNotificationStatus()
      }
    }
  }
  getPayload () {
    this.generatePayload()
    return this.payload
  }
}

export default NewNotification
