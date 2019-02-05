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
import { getSearchByTypeService } from '../../libs/calendar'

class SearchByTypeResult extends GarbageHandler {
    canHandle(handlerInput: HandlerInput) {
        if (!isMatchedIntent(handlerInput, 'AskGarbageTypeIntent')) return false
        return isDialogCompleted(handlerInput)
    }
    async handle(handlerInput: HandlerInput) {
      const town = getSlotValue(handlerInput, 'town')
      const garbageType = getSlotValue(handlerInput, 'garbageType')
      if (!garbageType) {
        return handlerInput.responseBuilder
          .speak('ゴミの種類を聞き取ることができませんでした。もう一度ゴミの種類をお教えください。')
          .reprompt(`${ASK_MORE}${END_HINT}`)
          .withSimpleCard(this.config.SKILL_NAME, 'ゴミの種類を聞き取ることができませんでした。もう一度ゴミの種類をお教えください。')
          .getResponse()
      }
      const cardTitle = `${town}での${garbageType}の回収日`
      if (garbageType === '粗大ゴミ') {
        const messages = this.config.OVERSIZE_MESSSAGE
        messages.push(ASK_MORE)
        const speechText = messages.join('')
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(`${ASK_MORE}${END_HINT}`)
          .withSimpleCard(cardTitle, speechText)
          .getResponse()
      }
      updateSessionAttributes(handlerInput, {
        town,
        garbageType
      })
      const service = getSearchByTypeService(this.config.CALENDAR, this.config.CITY_NAME)
      const result = service.searchByTownName(town, garbageType)
      console.log(JSON.stringify(result))
      updateSessionAttributes(handlerInput, {
        searchResult: result,
        nextAction: result.nextAction
      })
      const speechText = [
        `${town}での${garbageType}の回収日は、`,
        result.dateList.join('と'),
        'です。'
      ]
      const cardContent = result.dateList
      if (result.nextDate) {
        speechText.push('次回の回収日は、')
        speechText.push(`${result.nextDate.month}月${result.nextDate.day}日です。`)
        cardContent.push('')
        cardContent.push('次回回収日')
        cardContent.push(`${result.nextDate.month}月${result.nextDate.day}日`)
      }

      return handlerInput.responseBuilder
        .speak(speechText.join(''))
        .withSimpleCard(cardTitle, cardContent.join('\n'))
        .getResponse()
    }
}


export default SearchByTypeResult
