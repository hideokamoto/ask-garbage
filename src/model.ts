import * as Ask from 'ask-sdk';
import * as model from 'ask-sdk-model';

export namespace LaunchRequestInterfaces {
    export interface RequestEnvelope extends model.RequestEnvelope {
        'request': model.LaunchRequest
    }
    export interface HandlerInput extends Ask.HandlerInput {
        requestEnvelope: RequestEnvelope;
    }
}

export type skillConfig = {
    DB_TABLE_NAME: string
    SKILL_NAME: string
    SUPPORT_TOWN: string
    NOTIFY_DEFAULT_TIME: string
    NOTIFY_DEFAULT_TIME_STRING: string
    CITY_NAME: string
    HELP_MESSAGES: string[]
    OVERSIZE_MESSSAGE: string[]
    CALENDAR: {
        [city_name: string]: {
            [town_name: string] : {
                [type: string]: string[]
            }
        }
    }
}