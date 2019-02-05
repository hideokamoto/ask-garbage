import {RequestHandler, HandlerInput } from 'ask-sdk';
import { IntentRequest, Intent, Slot } from 'ask-sdk-model';

// fixtures
import {
  isMatchedIntent,
} from '../../fixtures/intentHandler'
import {
  getSlotValue
} from '../../fixtures/slot'
import {
  updateSessionAttributes
} from '../../fixtures/attributeManager'
import {
  isDialogCompleted
} from '../../fixtures/dialog'
import {
  getRandomMessage
} from '../../fixtures/responseHelpers'

// util
import {
  END_HINT
} from '../../constants'
import GarbageHandler from '../GarbageHandler'

interface SearchByTypeIntent extends Intent {
  slots: {
    town: Slot
  }
}
interface SearchByTypeRequest extends IntentRequest {
  intent: SearchByTypeIntent
}

class SearchByTypeInprogress extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
      if (!isMatchedIntent(handlerInput, 'AskGarbageTypeIntent')) return false
      return !isDialogCompleted(handlerInput)
  }
  async handle(handlerInput: HandlerInput) {
    const town = getSlotValue(handlerInput, 'town')
    const request = handlerInput.requestEnvelope.request as SearchByTypeRequest
    const { intent } = request
    if (!town) {
      const { persistedTownName } = await handlerInput.attributesManager.getPersistentAttributes()
      if (!persistedTownName) {
        const speechText = getRandomMessage([
          '町名を教えてください。',
          `現在サポートしている町は、${this.config.SUPPORT_TOWN}です。どの町について知りたいですか？`,
          'どの町について知りたいですか？'
        ])
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText + END_HINT)
          .addElicitSlotDirective('town')
          .withSimpleCard(this.config.SKILL_NAME, speechText)
          .getResponse()
      }
      intent.slots.town.value = persistedTownName
      updateSessionAttributes(handlerInput, {
        persistedTownName
      })
    }
    return handlerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse()
  }
}

export default SearchByTypeInprogress