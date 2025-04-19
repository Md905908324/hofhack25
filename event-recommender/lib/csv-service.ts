import type { Event } from "./types"
import { generateCategory, generateMoodTags } from "./ai-service"

// Function to fetch and parse CSV data
export async function fetchCSVEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Md905908324/hofhack25/refs/heads/main/combined_data.csv",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.status}`)
    }

    const csvText = await response.text()
    return parseCSVData(csvText)
  } catch (error) {
    console.error("Error fetching CSV data:", error)
    return []
  }
}

// Parse CSV data into Event objects
function parseCSVData(csvText: string): Event[] {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",")

  const events: Event[] = []

  // Start from index 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle commas within quoted fields
    const values: string[] = []
    let currentValue = ""
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(currentValue)
        currentValue = ""
      } else {
        currentValue += char
      }
    }

    // Add the last value
    values.push(currentValue)

    // Create event object
    try {
      const name = values[0].replace(/^"|"$/g, "")
      const datetimeStr = values[1].replace(/^"|"$/g, "")
      const location = values[2]?.replace(/^"|"$/g, "") || "TBD"
      const isAllDay = values[3]?.replace(/^"|"$/g, "").toLowerCase() === "true"
      const description = values[5]?.replace(/^"|"$/g, "") || `Join us for ${name}`

      // Parse datetime
      const datetime = new Date(datetimeStr)

      // Skip invalid dates
      if (isNaN(datetime.getTime())) continue

      // Create end time (2 hours after start for regular events, end of day for all-day events)
      const endTime = new Date(datetime)
      if (isAllDay) {
        endTime.setHours(23, 59, 59)
      } else {
        endTime.setHours(endTime.getHours() + 2)
      }

      // Generate AI category and mood tags
      const category = generateCategory(name, description)
      const moodTags = generateMoodTags(name, category, description)

      events.push({
        id: `csv-${i}`,
        title: name,
        description: description,
        startTime: datetime.toISOString(),
        endTime: endTime.toISOString(),
        location: location,
        url: "#",
        source: "csv",
        category: category,
        moodTags: moodTags,
      })
    } catch (error) {
      console.error(`Error parsing line ${i}:`, error)
    }
  }

  return events
}

// Function to filter events based on free time slots
export function filterEventsByFreeTimeSlots(events: Event[], freeTimeSlots: { start: string; end: string }[]): Event[] {
  return events.filter((event) => {
    const eventStart = new Date(event.startTime).getTime()
    const eventEnd = new Date(event.endTime).getTime()

    // Check if the event fits into any free time slot
    return freeTimeSlots.some((slot) => {
      const slotStart = new Date(slot.start).getTime()
      const slotEnd = new Date(slot.end).getTime()

      // Event fits if it starts after slot start and ends before slot end
      return eventStart >= slotStart && eventEnd <= slotEnd
    })
  })
}
