import {HandlerInput} from 'ask-sdk';
import SearchByTown from '../SearchByDate/Search'
// fixtures
import {
  isYesIntent
} from '../../fixtures/intentHandler'
import {
  getSessionAttribute
} from '../../fixtures/attributeManager'

export default class SearchOtherDay extends SearchByTown {
  canHandle(handlerInput: HandlerInput) {
    if (!isYesIntent(handlerInput)) return false
    const state = getSessionAttribute(handlerInput, 'nextAction')
    return state === 'searchOtherDay'
  }
}