import Engine from 'garbage-calendar-engine';

export const getCalendarService = (targetCalendar: {}, cityName: string) => {
    const calendar = new Engine.Entities.Calendar(targetCalendar, cityName)
    return new Engine.Services.SearchByDateService(calendar)
}

export const getSearchByTypeService = (targetCalendar: {}, cityName: string) => {
    const calendar = new Engine.Entities.Calendar(targetCalendar, cityName)
    return new Engine.Services.SearchByTypeService(calendar)
}
