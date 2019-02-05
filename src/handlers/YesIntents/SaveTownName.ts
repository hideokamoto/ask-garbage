import {HandlerInput} from 'ask-sdk';
import SaveTownName from '../SaveUserData/SaveTownName'
// fixtures
import {
    isYesIntent
} from '../../fixtures/intentHandler'
import {
    getSessionAttribute
} from '../../fixtures/attributeManager'

export default class SaveTown extends SaveTownName {
    canHandle(handlerInput: HandlerInput) {
        if (!isYesIntent(handlerInput)) return false
        const state = getSessionAttribute(handlerInput, 'nextAction')
        return state === 'saveTownName'
    }
}
