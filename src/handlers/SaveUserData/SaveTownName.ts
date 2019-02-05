import {RequestHandler, HandlerInput} from 'ask-sdk';

// fixtures
import {
  isMatchedIntent
} from '../../fixtures/intentHandler'
import {
  getSessionAttribute
} from '../../fixtures/attributeManager'
// util
import GarbageHandler from '../GarbageHandler'


class SaveTownName extends GarbageHandler {
  canHandle(handlerInput: HandlerInput) {
    // @TODO 町名ダイレクト保存モード
    return isMatchedIntent(handlerInput, 'SaveTownName')
  }
  async handle(handlerInput: HandlerInput) {
    const town = getSessionAttribute(handlerInput, 'town')
    if (!town) {
      // @TODO 町名ダイレクト保存モード
      // YesIntent経由ならまず消えてないからとりあえずそっとしておく
    }
    await handlerInput.attributesManager.setPersistentAttributes({
      persistedTownName: town
    })
    await handlerInput.attributesManager.savePersistentAttributes()

    const speechText = '町名を保存しました。次回から町名を省略してゴミの日を確認することができます。'
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(this.config.SKILL_NAME, speechText)
      .getResponse()
  }
}

export default SaveTownName