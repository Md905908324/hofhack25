"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { connectToGoogleCalendar } from "@/lib/calendar-service"
import { Loader2, CalendarIcon } from "lucide-react"

export default function CalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeRange, setTimeRange] = useState({ start: 9, end: 17 })

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const result = await connectToGoogleCalendar()
      setIsConnected(result)
    } catch (error) {
      console.error("Failed to connect to calendar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>Connect your Google Calendar to find free time slots</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-gray-500 mb-4">Connect your Google Calendar to get started</p>
            <Button onClick={handleConnect} disabled={isLoading} className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Connect Google Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Select date range</h3>
              <div className="flex justify-center">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Preferred time range</h3>
              <div className="flex items-center gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Start</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={timeRange.start}
                      onChange={(e) => setTimeRange({ ...timeRange, start: Number.parseInt(e.target.value) })}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={`start-${i}`} value={i}>
                          {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={timeRange.end}
                      onChange={(e) => setTimeRange({ ...timeRange, end: Number.parseInt(e.target.value) })}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={`end-${i}`} value={i}>
                          {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter>
          <Button className="w-full" onClick={() => window.location.reload()}>
            Find Available Events
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
