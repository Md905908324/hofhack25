"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFreeTimeSlots } from "@/lib/calendar-service"
import { getRecommendedEvents } from "@/lib/event-service"
import type { Event, FreeTimeSlot } from "@/lib/types"

export default function EventRecommendations() {
  const [freeTimeSlots, setFreeTimeSlots] = useState<FreeTimeSlot[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [likedEvents, setLikedEvents] = useState<string[]>([])
  const [dislikedEvents, setDislikedEvents] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would check if the user is authenticated first
        const slots = await getFreeTimeSlots()
        setFreeTimeSlots(slots)

        if (slots.length > 0) {
          const events = await getRecommendedEvents(slots)
          setRecommendedEvents(events)
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

  const filteredEvents = recommendedEvents.filter((event) => {
    if (activeTab === "all") return true
    if (activeTab === "liked") return likedEvents.includes(event.id)
    return event.source === activeTab
  })

  const sources = [...new Set(recommendedEvents.map((event) => event.source))]

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
          <CardDescription>Connect your calendar to see event recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No calendar data available. Please connect your calendar to get started.
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
                      {new Date(slot.start).toLocaleDateString()} from{" "}
                      {new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to{" "}
                      {new Date(slot.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            {sources.map((source) => (
              <TabsTrigger key={source} value={source}>
                {source.split(".")[0]}
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
                    <Badge variant="outline">{event.source.split(".")[0]}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(event.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                        {new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

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
