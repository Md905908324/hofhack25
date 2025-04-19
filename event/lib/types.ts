export interface FreeTimeSlot {
  start: string // ISO string
  end: string // ISO string
}

export interface Event {
  id: string
  title: string
  description: string
  startTime: string // ISO string
  endTime: string // ISO string
  location?: string
  url: string
  source: string // The website source
}

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location?: string
}
