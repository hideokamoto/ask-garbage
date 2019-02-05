import { ResponseBuilder} from 'ask-sdk';
import * as moment from 'moment'
import { Response } from 'ask-sdk-model';
export type garbageInfo = {
  found: boolean,
  garbageList: {item: string, date: string[]}[],
  isTomorrow: boolean,
  nextAction: string,
  targetDate: {
    year: string,
    month: string,
    day: string
  } | '',
}

type Query = {
  persistedTownName?: string,
  town: string,
  date: string
}
class SearchResultResponseBuilder {
  private garbageData: garbageInfo
  private town: string
  private date: string
  private isPertistedTownname: boolean
  private responseBuilder: ResponseBuilder
  constructor(garbageData: garbageInfo, query: Query, responseBuilder: ResponseBuilder) {
    this.garbageData = garbageData
    this.town = query.town
    this.date = moment(query.date).format('MM月DD日')
    this.responseBuilder = responseBuilder
    this.isPertistedTownname = !!(query.persistedTownName)
  }
  getTargetDate(): string {
    if (!this.garbageData.isTomorrow) return this.date
    if (this.garbageData.targetDate) return `${this.garbageData.targetDate.month}月${this.garbageData.targetDate.day}日`
    return this.date
  }
  getFirstLine(): string {
    const targetDate = this.getTargetDate()
    if (!this.garbageData.isTomorrow) return `${targetDate}、${this.town}のゴミは`
    const messages = [`${this.date}の回収時間はすでに過ぎています。`]
    if (this.garbageData.targetDate) {
      messages.push(`明日、${targetDate}、${this.town}のゴミは`)
    }
    return messages.join('')
  }
  getNextAction(): string {
    if (!this.isPertistedTownname) return '町名を保存しますか？'
    if (this.garbageData.nextAction === 'putReminder') return 'リマインダーを登録しますか？'
    return '他の日について調べますか？'
  }
  getSpeechText(): string {
    const garbageItems = this.garbageData.garbageList.map(data => data.item)
    const speechMessages = [
      this.getFirstLine(),
      garbageItems.join('と'),
      'です。',
      this.getNextAction()
    ]
    return speechMessages.join('')
  }
  getCardText(): {
    title: string,
    content: string
  } {
    const targetDate = this.getTargetDate()
    const garbageItems = this.garbageData.garbageList.map(data => data.item)
    return {
      title: `${this.town}のゴミ(${targetDate})`,
      content: garbageItems.join('\n')
    }
  }
  getResponse(): Response {
    const speechText = this.getSpeechText()
    const card = this.getCardText()
    return this.responseBuilder
      .speak(speechText)
      .reprompt(this.getNextAction())
      .withSimpleCard(card.title, card.content)
      .getResponse()
  }
}

export default SearchResultResponseBuilder