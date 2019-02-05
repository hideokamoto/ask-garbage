import {HandlerInput} from 'ask-sdk';
import * as rq from 'request-promise';
import {
  getApiEndPoint,
  getApiAccessToken
}  from './fixtures'


type payloadItem = {}
class RemidnerAdaptor {
  private request: any
  private apiAccessToken: string
  private apiEndpoint: string
  private payload: payloadItem
  constructor (handlerInput: HandlerInput, rp = rq) {
    this.apiAccessToken = getApiAccessToken(handlerInput)
    this.apiEndpoint = getApiEndPoint(handlerInput)
    this.request = rp
    this.payload = {}
  }
  getApiAccessToken () {
    return this.apiAccessToken
  }
  getApiEndpoint () {
    return this.apiEndpoint
  }
  getPayload () {
    return this.payload
  }
  getHeader (method: string) {
    const apiAccessToken = this.getApiAccessToken()
    // const payload = this.getPayload()
    const header = {
      'Authorization': `Bearer ${apiAccessToken}`,
      'Content-Type': 'application/json;'
    }
    // if (method !== 'GET') header['Content-Length'] = JSON.stringify(payload).length
    return header
  }
  getRequestParams (method: string = 'GET', path: string = '/v1/alerts/reminders') {
    const apiEndpoint = this.getApiEndpoint()
    const params: {
      method: string,
      uri: string,
      headers: {[item: string]: string},
      json: boolean,
      resolveWithFullResponse: boolean,
      body?: any
    } = {
      method,
      uri: `${apiEndpoint}${path}`,
      headers: this.getHeader(method),
      json: true,
      resolveWithFullResponse: true
    }
    if (method !== 'GET') params.body = this.getPayload()
    return params
  }
  setPayload (payload: payloadItem) {
    this.payload = payload
  }
  async fetch (method = 'GET', path = '/v1/alerts/reminders') {
    const params = this.getRequestParams(method, path)
    console.log('Request: %j', params)
    try {
      const response = await this.request(params)
      console.log('Response: %j', response)
      return response
    } catch (e) {
      console.log('RequestError: %j', e)
      throw e
    }
  }
}

export default RemidnerAdaptor
