import {ResponseFactory} from 'ask-sdk'
// target
import SearchResultResponseBuilder from '../../../src/libs/responseBuilder/searchByDate'

describe('libs/responseBuilder/searchByDate.ts', () => {
  describe('getSearchResult()', () => {
    let responseBuilder = ResponseFactory.init()
    beforeEach(() => responseBuilder = ResponseFactory.init())
    it('should ask to save the town name', () => {
      const item = {
        found: true,
        garbageList: [
          {
            item: "もやすごみ",
            date: [
              "毎週月曜",
              "毎週木曜"
            ]
          }
        ],
        isTomorrow: false,
        nextAction: 'putReminder',
        targetDate: {
          year: "2019",
          month: "01",
          day: "28"
        }
      }
      const query = {
        town: '米花町',
        date: '1999-01-01'
      }
      const builder = new SearchResultResponseBuilder(item, query, responseBuilder)
      const result = builder.getResponse()
      expect(result).toEqual({
        shouldEndSession: false,
        reprompt: {
          outputSpeech: {
            ssml: "<speak>町名を保存しますか？</speak>",
            type: "SSML"
          }
        },
        outputSpeech: {
          ssml: "<speak>01月01日、米花町のゴミはもやすごみです。町名を保存しますか？</speak>",
          type: "SSML"
        },
        card: {
          content: 'もやすごみ',
          title: '米花町のゴミ(01月01日)',
          type: "Simple"
        }
      })
    })
    it('should ask to save the town name', () => {
      const item = {
        found: true,
        garbageList: [
          {
            item: "もやすごみ",
            date: [
              "毎週月曜",
              "毎週木曜"
            ]
          }
        ],
        isTomorrow: false,
        nextAction: 'putReminder',
        targetDate: {
          year: "2019",
          month: "01",
          day: "28"
        }
      }
      const query = {
        town: '米花町',
        date: '1999-01-01',
        persistedTownName: '米花町'
      }
      const builder = new SearchResultResponseBuilder(item, query, responseBuilder)
      const result = builder.getResponse()
      expect(result).toEqual({
        shouldEndSession: false,
        reprompt: {
          outputSpeech: {
            ssml: "<speak>リマインダーを登録しますか？</speak>",
            type: "SSML"
          }
        },
        outputSpeech: {
          ssml: "<speak>01月01日、米花町のゴミはもやすごみです。リマインダーを登録しますか？</speak>",
          type: "SSML"
        },
        card: {
          content: 'もやすごみ',
          title: '米花町のゴミ(01月01日)',
          type: "Simple"
        }
      })
    })
  })
})