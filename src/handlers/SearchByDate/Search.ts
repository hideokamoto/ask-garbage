import {RequestHandler, HandlerInput} from 'ask-sdk';

// fixtures
import {
  isMatchedIntent
} from '../../fixtures/intentHandler'
// util
import {
  ASK_MORE, END_HINT
} from '../../constants'
import GarbageHandler from '../GarbageHandler'

class SearchByTown extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
      return isMatchedIntent(handlerInput, 'SearchGarbageByDate')
  }
  async handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
        .speak('何日のゴミについて調べますか？')
        .reprompt(ASK_MORE + END_HINT)
        .getResponse()
  }
}

export default SearchByTown