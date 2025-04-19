"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ExternalLink, ThumbsUp, ThumbsDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFreeTimeSlots } from "@/lib/calendar-service"
import { getRecommendedEvents } from "@/lib/event-service"
import { getAllMoodTags } from "@/lib/ai-service"
import type { Event, FreeTimeSlot } from "@/lib/types"

export default function EventRecommendations() {
  const [freeTimeSlots, setFreeTimeSlots] = useState<FreeTimeSlot[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [likedEvents, setLikedEvents] = useState<string[]>([])
  const [dislikedEvents, setDislikedEvents] = useState<string[]>([])
  const [showFreeTimeSlots, setShowFreeTimeSlots] = useState(false)
  const [moodSearch, setMoodSearch] = useState("")
  const [availableMoods, setAvailableMoods] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would check if the user is authenticated first
        const slots = await getFreeTimeSlots()
        setFreeTimeSlots(slots)

        if (slots.length > 0) {
          const events = await getRecommendedEvents(slots)
          setRecommendedEvents(events)

          // Get all available moods
          setAvailableMoods(getAllMoodTags())
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLike = (eventId: string) => {
    setLikedEvents([...likedEvents, eventId])
    setDislikedEvents(dislikedEvents.filter((id) => id !== eventId))
  }

  const handleDislike = (eventId: string) => {
    setDislikedEvents([...dislikedEvents, eventId])
    setLikedEvents(likedEvents.filter((id) => id !== eventId))
  }

  // Get unique categories from events (excluding source identifiers)
  const categories = [...new Set(recommendedEvents.map((event) => event.category).filter(Boolean))]

  const filteredEvents = recommendedEvents
    .filter((event) => {
      // Filter by tab selection
      if (activeTab === "all") return true
      if (activeTab === "liked") return likedEvents.includes(event.id)
      return event.category === activeTab
    })
    .filter((event) => {
      // Filter by mood search (if provided)
      if (!moodSearch) return true
      return event.moodTags?.some((mood) => mood.toLowerCase().includes(moodSearch.toLowerCase()))
    })

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading recommendations...</CardTitle>
          <CardDescription>Please wait while we find events for your free time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (freeTimeSlots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Calendar</CardTitle>
          <CardDescription>Upload your calendar to see event recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No calendar data available. Please upload your calendar to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (recommendedEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Events Found</CardTitle>
          <CardDescription>We couldn't find any events that match your free time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-gray-500">
              Try adjusting your time preferences or check back later for new events.
            </p>
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Your Free Time Slots</h3>
              <ul className="space-y-2">
                {freeTimeSlots.map((slot, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {formatDate(slot.start)} from {formatTime(slot.start)} to {formatTime(slot.end)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Events</CardTitle>
        <CardDescription>Events that fit your free time slots</CardDescription>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowFreeTimeSlots(!showFreeTimeSlots)}>
              {showFreeTimeSlots ? "Hide Free Time Slots" : "Show Free Time Slots"}
            </Button>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by mood (e.g., Fun, Relaxing, Inspiring)"
                value={moodSearch}
                onChange={(e) => setMoodSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {showFreeTimeSlots && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Your Free Time Slots</h3>
              <div className="max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {freeTimeSlots.map((slot, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatDate(slot.start)} from {formatTime(slot.start)} to {formatTime(slot.end)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={`category-${category}`} value={category as string}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredEvents.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No events found for this filter</p>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex gap-2">
                      {event.category && (
                        <Badge variant="outline" className="bg-gray-100">
                          {event.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Mood Tags */}
                  {event.moodTags && event.moodTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.moodTags.map((mood, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant={likedEvents.includes(event.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLike(event.id)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>Like</span>
                      </Button>
                      <Button
                        variant={dislikedEvents.includes(event.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDislike(event.id)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="h-3 w-3" />
                        <span>Not interested</span>
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" asChild className="flex items-center gap-1">
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                        <span>View</span>
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
