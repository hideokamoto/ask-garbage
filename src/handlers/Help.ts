import {RequestHandler, HandlerInput} from 'ask-sdk';

// fixtures
import {
    isHelpIntent
} from '../fixtures/intentHandler'

// util
import {
    ASK_MORE, END_HINT
} from '../constants'
import GarbageHandler from './GarbageHandler'

class HelpIntent extends GarbageHandler {
    canHandle(handlerInput: HandlerInput) {
        return isHelpIntent(handlerInput)
    }
    async handle(handlerInput: HandlerInput) {
        const messages = this.config.HELP_MESSAGES
        const cardText = messages.join('\n')
        const speechText = messages.map(message => `<p>${message}</p>` ).join('')
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(ASK_MORE + END_HINT)
            .withSimpleCard(this.config.SKILL_NAME, cardText)
            .getResponse();
    }
}

export default HelpIntent