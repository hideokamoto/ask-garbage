import {RequestHandler, HandlerInput, ResponseBuilder} from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import * as moment from 'moment'

// fixtures
import {
  isMatchedIntent
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
import GarbageHandler from '../GarbageHandler'

// util
import {
    ASK_MORE, END_HINT
} from '../../constants'
import { getCalendarService } from '../../libs/calendar'
import SearchResultResponseBuilder from '../../libs/responseBuilder/searchByDate'

class SearchByTownResult extends GarbageHandler {
    canHandle(handlerInput: HandlerInput) {
        if (!isMatchedIntent(handlerInput, 'AskGarbageDateIntent')) return false
        return isDialogCompleted(handlerInput)
    }
    noGarbageDateResponse(responseBuilder: ResponseBuilder, date: string = 'その日'): Response {
      const messages = [
          `${date}はゴミの回収がない様子です。`,
          '他の日について調べますか？'
      ]
      const cardText = messages.join('\n')
      const speechText = messages.map(message => `<p>${message}</p>` ).join('')
      return responseBuilder
        .speak(speechText)
        .reprompt(ASK_MORE + END_HINT)
        .withSimpleCard(this.config.SKILL_NAME, cardText)
        .getResponse()
    }
    unSupportedTownResponse(responseBuilder: ResponseBuilder, town: string): Response {
      const messages = [
        'すみません。',
        `${town}のゴミの日はまだサポートされていません。`,
        '他の町のゴミの日についてしらべますか？'
      ]
      const cardText = messages.join('\n')
      const speechText = messages.map(message => `<p>${message}</p>` ).join('')
      return responseBuilder
        .speak(speechText)
        .reprompt(ASK_MORE + END_HINT)
        .withSimpleCard(this.config.SKILL_NAME, cardText)
        .getResponse()
    }
    async handle(handlerInput: HandlerInput) {
      const { responseBuilder } = handlerInput
      const { persistedTownName } = await handlerInput.attributesManager.getPersistentAttributes()
      const town = getSlotValue(handlerInput, 'town') || persistedTownName
      const date = getSlotValue(handlerInput, 'date')
      const service = getCalendarService(this.config.CALENDAR, this.config.CITY_NAME)
      try {
        updateSessionAttributes(handlerInput, {
          town,
        })
        const result = service.searchByDate(town, moment(date).toDate())
        console.log(JSON.stringify(result))

        updateSessionAttributes(handlerInput, {
          searchResult: result,
          nextAction: getNextAction(result.nextAction, persistedTownName)
        })
        if (!result.found) return this.noGarbageDateResponse(responseBuilder, moment(date).format('MM月DD日'))
        const builder = new SearchResultResponseBuilder(result, {town, date, persistedTownName}, responseBuilder)
        return builder.getResponse()
      } catch (e) {
        if (!/unsupported town/.test(e.message)) throw e
        return this.unSupportedTownResponse(responseBuilder, town)
      }
    }
}

const getNextAction = (nextAction: string, persistedTownName?: string):string => {
  if (nextAction === 'searchOtherDay') return nextAction
  if(!persistedTownName) return 'saveTownName'
  return nextAction
}

export default SearchByTownResult
