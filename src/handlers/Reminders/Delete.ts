import {RequestHandler, HandlerInput} from 'ask-sdk';

// fixtures
import {
  isMatchedIntent
} from '../../fixtures/intentHandler'
import {
  getSessionAttributes
} from '../../fixtures/attributeManager'
import {
  isConsented
} from '../../fixtures/user'
import {
  getSlotValue
} from '../../fixtures/slot'
// util
import {
  STATE,
} from '../../constants'
import {
  unConsentedResponse
} from '../../libs/responseBuilder/reminder'
import GarbageHandler from '../GarbageHandler'

// v1
const RemidnerAdaptor = require('../../v1/reminderAdaptor')

class DeleteReminder extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
    return isMatchedIntent(handlerInput, 'DeleteReminderIntent')
  }
  async handle(handlerInput: HandlerInput) {
    if (!isConsented(handlerInput)) return unConsentedResponse(handlerInput)
    const { state, upComingAlerts } = getSessionAttributes(handlerInput)
    if (state !== STATE.DELETE_REMINDER || upComingAlerts.length < 1) {
      return handlerInput.responseBuilder
        .speak('削除できるリマインダーがありませんでした。')
        .getResponse()
    }
    const deletedNumber: number = Number(getSlotValue(handlerInput, 'number'))
    const Adaptor = new RemidnerAdaptor(handlerInput)
    const target = upComingAlerts[deletedNumber - 1] as any
    if (!target || Object.keys(target).length < 1) {
      return handlerInput.responseBuilder
        .speak('削除できるリマインダーが見つかりませんでした。')
        .getResponse()
    }
    const id = target.alertToken
    try {
      await Adaptor.fetch('DELETE', `/v1/alerts/reminders/${id}`)
      return handlerInput.responseBuilder
        .speak(`リマインダーを削除しました。`)
        .getResponse()
    } catch (err) {
      console.log(JSON.stringify(err))
      if (err.statusCode === 401 || err.statusCode === 403) return unConsentedResponse(handlerInput)
      throw err
    }
  }
}

export default DeleteReminder
