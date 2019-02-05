import {RequestHandler, HandlerInput} from 'ask-sdk';
import { garbageInfo } from '../../libs/responseBuilder/searchByDate'
// fixtures
import {
  isMatchedIntent
} from '../../fixtures/intentHandler'
import {
  getSessionAttribute,
  updateSessionAttributes
} from '../../fixtures/attributeManager'
import {
  isConsented
} from '../../fixtures/user'
// util
import {
  getMoment
} from '../../libs/moment'
import {
  unConsentedResponse,
  errorResponse
} from '../../libs/responseBuilder/reminder'
import GarbageHandler from '../GarbageHandler'

// v1
const RemidnerAdaptor = require('../../v1/reminderAdaptor')
const NewNotification = require('../../v1/newNotification')

const requestReminderText = [
  'リマインダーを登録するために、アプリの設定を更新する必要があります。',
  'リマインダーへのアクセスを許可することで、ゴミ出しの時間をリマインダーに登録することができます。',
  'アレクサアプリからリマインダーへのアクセスを許可した後で、もう一度お試しください。'
].join('')

class PutReminder extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
    return isMatchedIntent(handlerInput, 'SetReminderIntent')
  }
  async handle(handlerInput: HandlerInput) {
    if (!isConsented(handlerInput)) return unConsentedResponse(handlerInput, requestReminderText)
    const searchResult: garbageInfo = getSessionAttribute(handlerInput, 'searchResult') as any
    if (!searchResult.targetDate) {
      return errorResponse(handlerInput, '日付が見つかりませんでした。他に何か調べますか？')
    }
    const day = `${searchResult.targetDate.month}月${searchResult.targetDate.day}日`
    const garbageLists = searchResult.garbageList.map(data => data.item)
    const garbageStrings = garbageLists.join('と')

    const moment = getMoment()
    const locale = 'ja-JP'
    // オブジェクトにまとめる。テスト書く
    const Notification = new NewNotification(locale)
    Notification.enablePushNotification()
    // createdTimeを現在時刻でセットする
    const now = moment()
    Notification.setCreatedTime(now)
    // trigger.scheduledTimeをゴミ回収の日付の7:00で登録する
    const notificationTime = moment(`${day} ${this.config.NOTIFY_DEFAULT_TIME}`, 'MM月DD日 HH')
    Notification.setScheduledTime(notificationTime)
    Notification.setTriggerType('SCHEDULED_ABSOLUTE')
    Notification.setContents([
      {
        locale: 'ja-JP',
        text: `${garbageStrings}のゴミ捨て`
      }
    ])
    const payload = Notification.getPayload()
    const Adaptor = new RemidnerAdaptor(handlerInput)
    Adaptor.setPayload(payload)
    
    try {
      await Adaptor.fetch('POST')
      return handlerInput.responseBuilder
        .speak(`リマインダーを登録しました。${day} の${this.config.NOTIFY_DEFAULT_TIME_STRING}におしらせします。`)
        .withSimpleCard('ゴミ捨ての日をリマインド', `${day}\n${garbageStrings}`)
        .getResponse()
    } catch (err) {
      console.log(JSON.stringify(err))
      if (err.statusCode === 401) {
        return unConsentedResponse(handlerInput, requestReminderText)
      }
      if (err.statusCode === 403) {
        console.log(err.code)
        return errorResponse(handlerInput, 'このデバイスではリマインダーを登録することができません。リマインダー機能に対応したデバイスでもう一度試してみてください。他に何か調べますか？')
      }
      throw err
    }
  }
}

export default PutReminder