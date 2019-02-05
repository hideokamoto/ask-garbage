import * as Ask from 'ask-sdk';
// model
import {LaunchRequestInterfaces, skillConfig} from "../model";
import RequestHandler = Ask.RequestHandler

// fixtures
import {
    isLaunchRequest
} from '../fixtures/intentHandler'

// util
import {
    ASK_MORE, END_HINT
} from '../constants'

import GarbageHandler from './GarbageHandler'

class LaunchRequest extends GarbageHandler {
    canHandle(handlerInput: Ask.HandlerInput) {
        return isLaunchRequest(handlerInput)
    }
    async handle(handlerInput: LaunchRequestInterfaces.HandlerInput) {
        const speechText = [
            `${this.config.SKILL_NAME}へようこそ。`,
            '何日のゴミについて知りたいですか？'
        ].join('')
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(ASK_MORE + END_HINT)
            .withSimpleCard(this.config.SKILL_NAME, speechText)
            .getResponse();
    }
}

export default LaunchRequest
