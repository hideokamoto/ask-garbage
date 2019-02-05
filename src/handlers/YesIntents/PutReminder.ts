import {HandlerInput} from 'ask-sdk';
import BaseHandler from '../Reminders/Put'
// fixtures
import {
  isYesIntent
} from '../../fixtures/intentHandler'
import {
  getSessionAttribute
} from '../../fixtures/attributeManager'

export default class PutReminder extends BaseHandler {
  canHandle(handlerInput: HandlerInput) {
    if (!isYesIntent(handlerInput)) return false
    const state = getSessionAttribute(handlerInput, 'nextAction')
    return state === 'putReminder'
  }
}