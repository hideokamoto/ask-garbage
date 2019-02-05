import { HandlerInput} from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import {
  updateSessionAttributes
} from '../../fixtures/attributeManager'
import {
  END_HINT
} from '../../constants'
export const unConsentedResponse = (handlerInput: HandlerInput, messages?: string): Response => {
  const speechText = messages || 'リマインダーへのアクセス権限が必要です。アレクサアプリからリマインダーへのアクセスを許可した後で、もう一度お試しください。'
  return handlerInput.responseBuilder
    .speak(speechText)
    .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
    .getResponse()
}


export const errorResponse = (handlerInput: HandlerInput, message: string = 'うまく処理することができませんでした。他に何か調べますか？'): Response => {
  updateSessionAttributes(handlerInput, {
    nextAction: 'searchOtherDay'
  })
  return handlerInput.responseBuilder
    .speak(message)
    .reprompt('他に何か調べますか？' + END_HINT)
    .getResponse()
}