import {HandlerInput} from 'ask-sdk';
export const getApiEndPoint = (handlerInput: HandlerInput): string => {
  return handlerInput.requestEnvelope.context.System.apiEndpoint
}
export const getApiAccessToken = (handlerInput: HandlerInput): string => {
  return handlerInput.requestEnvelope.context.System.apiAccessToken as string
}
