type triggerItem = {
  type: string,
  scheduledTime: string
}
type spokenInfoItem = {
  content: string[]
}
type alertInfoItem = {
  spokenInfo: spokenInfoItem
}
type reminderItem = {
  status?: string,
  trigger?: triggerItem,
  type?: string,
  alertInfo?: alertInfoItem,
  alertToken?: string
}

class ReminderDetail {
  private item: reminderItem
  constructor (item: reminderItem) {
    this.item = item
  }
  getReminder () {
    return this.item
  }
  /**
   * Get Remidner status
   * @example
   * getStatus()
   * "COMPLETED"
   */
  getStatus () {
    if (this.item.status) return this.item.status
    return ''
  }
  /**
   * Is the reminder completed
   * @example
   * isCompleted()
   * true
   */
  isCompleted () {
    const status = this.getStatus()
    return status === 'COMPLETED'
  }
  /**
   * Get Reminder trigger time
   * @example
   * getTrigger()
   * {
   *   "type": "SCHEDULED_ABSOLUTE",
   *   "scheduledTime": "2018-11-30T07:30:00.000",
   *   "timeZoneId": "Asia/Tokyo",
   *   "offsetInSeconds": 0,
   *   "recurrence": null
   * }
   */
  getTrigger () {
    if (this.item.trigger) return this.item.trigger
    return {}
  }
  getTriggeredType () {
    const trigger = this.getTrigger() as triggerItem
    return trigger.type
  }
  /**
   * Get absule scheduled time
   * @example
   * getAbsulteScheduledTime()
   * "2018-11-30T07:30:00.000"
   */
  getAbsulteScheduledTime () {
    const trigger = this.getTrigger() as triggerItem
    return trigger.scheduledTime
  }
  /**
   * Get Alert info object
   * @example
   * getAlertInfo()
   * {
   *   "spokenInfo": {
   *     "content": [
   *       {
   *         "locale": "",
   *         "text": "Test Reminder",
   *         "ssml": ""
   *       }
   *     ]
   *   }
   * }
   */
  getAlertInfo () {
    if (this.item.alertInfo) return this.item.alertInfo
    return {}
  }
  /**
   * Get spoken info object
   * @example
   * getSpokenInfo()
   * {
   *   "content": [
   *     {
   *       "locale": "",
   *       "text": "Test Reminder",
   *       "ssml": ""
   *     }
   *   ]
   * }
   */
  getSpokenInfo () {
    const alert = this.getAlertInfo() as alertInfoItem
    if (alert.spokenInfo) return alert.spokenInfo
    return {}
  }
  /**
   * Get spoken info object
   * @example
   * getContents()
   * [
   *   {
   *     "locale": "",
   *     "text": "Test Reminder",
   *     "ssml": ""
   *   }
   * ]
   */
  getContents () {
    const spokenInfo = this.getSpokenInfo() as spokenInfoItem
    if (spokenInfo.content) return spokenInfo.content
    return []
  }
  /**
   * Get alert token to update / delete it
   * @example
   * getAlertToken()
   * d877f6b7-fe34-40fe-9029-a67a3f75140f
   */
  getAlertToken () {
    if (this.item.alertToken) return this.item.alertToken
    return ''
  }
}
export default ReminderDetail

/**
 * {
        "alertToken": "d877f6b7-fe34-40fe-9029-a67a3f75140f",
        "createdTime": "2018-10-30T15:44:59.336Z",
        "updatedTime": "2018-10-30T15:50:24.561Z",
        "trigger": {
          "type": "SCHEDULED_ABSOLUTE",
          "scheduledTime": "2018-11-30T07:30:00.000",
          "timeZoneId": "Asia/Tokyo",
          "offsetInSeconds": 0,
          "recurrence": null
        },
        "status": "COMPLETED",
        "alertInfo": {
          "spokenInfo": {
            "content": [
              {
                "locale": "",
                "text": "Test Reminder",
                "ssml": ""
              }
            ]
          }
        },
        "pushNotification": {
          "status": "ENABLED"
        },
        "version": "3"
      }
 */
