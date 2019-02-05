import {RequestHandler, HandlerInput} from 'ask-sdk';

// fixtures
import {
  isNoIntent,
  isCancelIntent,
  isStopIntent
} from '../fixtures/intentHandler'
import {
  getRandomMessage
} from '../fixtures/responseHelpers'
// util
import {
  STOP_MESSAGES
} from '../constants'

import GarbageHandler from './GarbageHandler'

class StopIntent extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
      return isNoIntent(handlerInput) || isCancelIntent(handlerInput) || isStopIntent(handlerInput)
  }
  async handle(handlerInput: HandlerInput) {
    const speechText = getRandomMessage(STOP_MESSAGES)

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(this.config.SKILL_NAME, speechText)
      .getResponse()
  }
}

export default StopIntent