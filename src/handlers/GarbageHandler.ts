import * as Ask from 'ask-sdk';
// model
import {skillConfig} from "../model";
import RequestHandler = Ask.RequestHandler
import HandlerInput = Ask.HandlerInput
export default class GarbageHandler implements RequestHandler {
  protected config: skillConfig
  constructor(config: skillConfig) {
      this.config = config
  }
  canHandle(handlerInput: HandlerInput) {
    return false
  }
  async handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder
      .speak('')
      .getResponse()
  }
}