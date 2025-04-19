import type { Event, FreeTimeSlot } from "./types"

// This function will fetch events from MongoDB and filter them based on free time slots
export async function getRecommendedEvents(freeTimeSlots: FreeTimeSlot[]): Promise<Event[]> {
  try {
    // Fetch events from MongoDB via API route
    const response = await fetch("/api/mongodb-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ freeTimeSlots }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch events from MongoDB")
    }

    const data = await response.json()

    // Transform MongoDB data to match our Event interface
    const events: Event[] = data.events.map((event: any, index: number) => ({
      id: event._id || `mongo-${index}`,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      url: event.url || "#",
      source: event.category || "mongodb",
      category: event.category,
    }))

    return events
  } catch (error) {
    console.error("Error fetching events from MongoDB:", error)

    // Fallback to mock data if MongoDB fetch fails
    return getMockEvents()
  }
}

// Fallback function to provide mock data if MongoDB fetch fails
function getMockEvents(): Event[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  return [
    {
      id: "1",
      title: "AI Research Symposium",
      description: "Join leading researchers for a discussion on the latest advances in artificial intelligence.",
      startTime: new Date(today.setHours(12, 30, 0, 0)).toISOString(),
      endTime: new Date(today.setHours(13, 30, 0, 0)).toISOString(),
      location: "Courant Institute, 251 Mercer St",
      url: "https://events.nyu.edu/ai-symposium",
      source: "events.nyu.edu",
      category: "Academic",
    },
    {
      id: "2",
      title: "Entrepreneurship Workshop",
      description: "Learn how to turn your ideas into a successful business venture.",
      startTime: new Date(tomorrow.setHours(15, 30, 0, 0)).toISOString(),
      endTime: new Date(tomorrow.setHours(16, 30, 0, 0)).toISOString(),
      location: "Stern School of Business, 44 W 4th St",
      url: "https://www.stern.nyu.edu/experience-stern/news-events/events/upcoming/entrepreneurship-workshop",
      source: "stern.nyu.edu",
      category: "Business",
    },
    // More mock events...
  ]
}
