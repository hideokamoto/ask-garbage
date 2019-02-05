

import LaunchRequest from './handlers/LaunchRequest'
import HelpIntent from './handlers/Help'
import SearchByTown from './handlers/SearchByDate/Index'
import YesIntents from './handlers/YesIntents/Index'
import ReminderIntents from './handlers/Reminders/Index'
import SearchByType from './handlers/SearchByType/Index'
import StopIntent from './handlers/Stop'
import { skillConfig } from './model'


const getGarbageIntentHandlers = (config: skillConfig) => {
  const handlerNames = [
      LaunchRequest,
      SearchByTown.Inprogress,
      SearchByTown.Result,
      SearchByTown.Search,
      SearchByType.Inprogress,
      SearchByType.Result,
      YesIntents.SearchOtherDay,
      YesIntents.SaveTownName,
      YesIntents.PutRemidner,
      ReminderIntents.Put,
      ReminderIntents.Delete,
      ReminderIntents.List,
      HelpIntent,
      StopIntent
  ]
  return handlerNames.map(handler => new handler(config))
}
export default getGarbageIntentHandlers
