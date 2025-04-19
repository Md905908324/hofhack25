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
  category?: string // Added category field
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

// MongoDB event interface
export interface MongoDBEvent {
  _id: string
  title: string
  description: string
  category: string
  location: string
  startTime: string
  endTime: string
  url?: string
}
