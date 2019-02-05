import {RequestHandler, HandlerInput} from 'ask-sdk';
// fixtures
import {
  isMatchedIntent
} from '../../fixtures/intentHandler'
import {
  isConsented
} from '../../fixtures/user'
import {
  updateSessionAttributes
} from '../../fixtures/attributeManager'
// util
import {
  END_HINT,
  STATE,
} from '../../constants'
import {
  getMoment
} from '../../libs/moment'
import {
  unConsentedResponse
} from '../../libs/responseBuilder/reminder'
import GarbageHandler from '../GarbageHandler'

// v1
import RemidnerAdaptor from '../../v1/reminderAdaptor'
import ReminderDetail from '../../v1/ReminderDetail'

// 西宮ゴミガイドでリマインダー一覧
class ListReminder extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
    return isMatchedIntent(handlerInput, 'ListRemindersIntent')
  }
  async handle(handlerInput: HandlerInput) {
    if (!handlerInput.serviceClientFactory) throw new Error('handlerInput.serviceClientFactory is not defined')
    if (!isConsented(handlerInput)) return unConsentedResponse(handlerInput)
    const Adaptor = new RemidnerAdaptor(handlerInput)

    try {
      const results = await Adaptor.fetch('GET')
      const { totalCount, alerts } = results.body
      if (totalCount < 1 || alerts.length < 1) {
        updateSessionAttributes(handlerInput, {
          nextAction: 'searchOtherDay'
        })
        return handlerInput.responseBuilder
          .speak('現在リマインダーは登録されていない様子です。他に何か調べますか？')
          .reprompt('他に何か調べますか？' + END_HINT)
          .getResponse()
      }
      const upComingAlerts = alerts.filter((alert: any) => {
        const reminder = new ReminderDetail(alert)
        return !reminder.isCompleted()
      })
      const moment = getMoment()
      const messages = upComingAlerts.map((alert:any, key: string) => {
        const reminder = new ReminderDetail(alert)
        const contents = reminder.getContents()
        const text = contents.map((c:any) => c.text).join('・')
        let time
        if (reminder.getTriggeredType() === 'SCHEDULED_ABSOLUTE') {
          time = moment(reminder.getAbsulteScheduledTime()).format('MM月DD日 kk時mm分')
        }
        return `${key + 1}番。${time}に${text}のリマインダーがあります。`
      })
      updateSessionAttributes(handlerInput, {
        upComingAlerts,
        state: STATE.DELETE_REMINDER
      })
      const reminders = messages.join('')
      const cardContents = messages.join('\n')
      return handlerInput.responseBuilder
        .speak(`登録済みのリマインダーは${messages.length}件あります。${reminders}。削除したいリマインダーがあれば、番号を教えてください。`)
        .reprompt('削除したいリマンダーがあれば、番号を教えてください。')
        .withSimpleCard('ゴミ捨ての日をリマインド', cardContents)
        .getResponse()
    } catch (err) {
      console.log(JSON.stringify(err))
      if (err.statusCode === 401 || err.statusCode === 403) return unConsentedResponse(handlerInput)
      throw err
    }
  }
}

export default ListReminder