# Alexa garbage kit

LGTM project for Alexa

## Usage

```
import * as Ask from 'ask-sdk';
import { skillConfig, getGarbageIntentHandlers } from 'ask-garbage'

const SUPPORT_TOWN = '松屋町・山手町'
const CITY_NAME = '米花市'
const config: skillConfig = {
    DB_TABLE_NAME: 'ASKNGomi',
    SKILL_NAME: '米花市ゴミガイド',
    NOTIFY_DEFAULT_TIME: '09:00',
    NOTIFY_DEFAULT_TIME_STRING: '午前9時',
    SUPPORT_TOWN,
    CITY_NAME,
    HELP_MESSAGES: [
        `このスキルでは、${CITY_NAME}で明日や特定の日に出すゴミの種類について聞くことができます。`,
        'ゴミの回収日を知りたい場合は、「明日のゴミは？」などと話しかけてください。',
        `サポートしている町名は、${SUPPORT_TOWN}です。`
    ],
    OVERSIZE_MESSSAGE: [
        '粗大ゴミの収集は有料で、申し込み予約が必要です。',
        '米花市のゴミ電話受付センターの電話番号は、<say-as interpret-as="telephone">0701234567</say-as>。',
        '電話受付時間は月曜から金曜日が午前9時から午後7時。土曜日曜が午前9時から午後5時です。'
    ],
    CALENDAR: {
        '米花市': {
            '山手町': {
                'もえるごみ': ['毎週月曜', '毎週木曜'],
                'もやさないごみ': ['毎週水曜'],
                'その他プラ': ['毎週火曜'],
                'ペットボトル': ['第一金曜', '第三金曜']
            },
            '松屋町': {
                'もえるごみ': ['毎週火曜', '毎週金曜'],
                'もやさないごみ': ['毎週水曜'],
                'その他プラ': ['毎週月曜'],
                'ペットボトル': ['第二木曜', '第四木曜']
            }
        }
    }
}

const getSkillPackage = (config: skillConfig) => {
    const handlers = getGarbageIntentHandlers(config)
    return Ask.SkillBuilders.standard()
        .addRequestHandlers(...handlers)
        .addErrorHandlers(ErrorHandler)
        .withTableName(config.DB_TABLE_NAME)
        .lambda()
}

export const alexa = getSkillPackage(config)
```