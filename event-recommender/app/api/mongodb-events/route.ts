import { NextResponse } from "next/server"
import type { FreeTimeSlot, MongoDBEvent } from "@/lib/types"
import { generateCategory, generateMoodTags } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { freeTimeSlots } = body as { freeTimeSlots: FreeTimeSlot[] }

    if (!freeTimeSlots || !Array.isArray(freeTimeSlots)) {
      return NextResponse.json({ error: "Invalid request: freeTimeSlots is required" }, { status: 400 })
    }

    // In a real implementation, this would connect to MongoDB and query events
    // For now, we'll simulate MongoDB data

    // Mock MongoDB data
    const mockMongoEvents: MongoDBEvent[] = [
      {
        _id: "mongo1",
        title: "Data Science Workshop",
        description: "Learn practical data science skills with Python and MongoDB.",
        category: generateCategory(
          "Data Science Workshop",
          "Learn practical data science skills with Python and MongoDB.",
        ),
        location: "60 5th Ave, New York, NY",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "Data Science Workshop",
          "Technology",
          "Learn practical data science skills with Python and MongoDB.",
        ),
      },
      {
        _id: "mongo2",
        title: "NYU Basketball Game",
        description: "NYU Violets vs. Columbia Lions. Student ID required for free entry.",
        category: generateCategory(
          "NYU Basketball Game",
          "NYU Violets vs. Columbia Lions. Student ID required for free entry.",
        ),
        location: "Palladium Athletic Facility, 140 E 14th St",
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "NYU Basketball Game",
          "Sports",
          "NYU Violets vs. Columbia Lions. Student ID required for free entry.",
        ),
      },
      {
        _id: "mongo3",
        title: "Philosophy Lecture Series",
        description: "Distinguished speakers discuss contemporary philosophical issues.",
        category: generateCategory(
          "Philosophy Lecture Series",
          "Distinguished speakers discuss contemporary philosophical issues.",
        ),
        location: "Silver Center, 100 Washington Square East",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "Philosophy Lecture Series",
          "Academic",
          "Distinguished speakers discuss contemporary philosophical issues.",
        ),
      },
      {
        _id: "mongo4",
        title: "Student Club Mixer",
        description: "Meet representatives from NYU's diverse student organizations.",
        category: generateCategory(
          "Student Club Mixer",
          "Meet representatives from NYU's diverse student organizations.",
        ),
        location: "Kimmel Center, 60 Washington Square South",
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "Student Club Mixer",
          "Social",
          "Meet representatives from NYU's diverse student organizations.",
        ),
      },
      {
        _id: "mongo5",
        title: "Career Fair: Tech Industry",
        description: "Connect with employers from leading technology companies.",
        category: generateCategory(
          "Career Fair: Tech Industry",
          "Connect with employers from leading technology companies.",
        ),
        location: "Tandon School of Engineering, 6 MetroTech Center",
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "Career Fair: Tech Industry",
          "Career",
          "Connect with employers from leading technology companies.",
        ),
      },
      {
        _id: "mongo6",
        title: "Art Exhibition Opening",
        description: "Opening reception for new student art exhibition.",
        category: generateCategory("Art Exhibition Opening", "Opening reception for new student art exhibition."),
        location: "80WSE Gallery, 80 Washington Square East",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "Art Exhibition Opening",
          "Arts & Culture",
          "Opening reception for new student art exhibition.",
        ),
      },
      {
        _id: "mongo7",
        title: "Volunteer Day: Community Garden",
        description: "Help maintain the Washington Square Park community garden.",
        category: generateCategory(
          "Volunteer Day: Community Garden",
          "Help maintain the Washington Square Park community garden.",
        ),
        location: "Washington Square Park",
        startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "Volunteer Day: Community Garden",
          "Community Service",
          "Help maintain the Washington Square Park community garden.",
        ),
      },
      {
        _id: "mongo8",
        title: "International Food Festival",
        description: "Sample cuisines from around the world prepared by NYU student clubs.",
        category: generateCategory(
          "International Food Festival",
          "Sample cuisines from around the world prepared by NYU student clubs.",
        ),
        location: "Kimmel Center, 60 Washington Square South",
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
        moodTags: generateMoodTags(
          "International Food Festival",
          "Food & Dining",
          "Sample cuisines from around the world prepared by NYU student clubs.",
        ),
      },
    ]

    // Filter events that fit into free time slots
    // In a real implementation, this would be done with a MongoDB query
    const filteredEvents = mockMongoEvents.filter((event) => {
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

    return NextResponse.json({ events: filteredEvents })
  } catch (error) {
    console.error("Error fetching MongoDB events:", error)
    return NextResponse.json({ error: "Failed to fetch events from MongoDB" }, { status: 500 })
  }
}
