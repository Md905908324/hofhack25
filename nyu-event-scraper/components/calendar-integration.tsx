"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { parseICSFile } from "@/lib/calendar-service"
import { Loader2, CalendarIcon, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeRange, setTimeRange] = useState({ start: 9, end: 17 })
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setFileName(file.name)

    try {
      const result = await parseICSFile(file)
      setIsConnected(result)
    } catch (error) {
      console.error("Failed to parse ICS file:", error)
      setError("Failed to parse the ICS file. Please make sure it's a valid calendar file.")
      setFileName(null)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>Upload your calendar file (.ics) to find free time slots</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8">
            <input type="file" ref={fileInputRef} accept=".ics" onChange={handleFileUpload} className="hidden" />
            <p className="text-center text-gray-500 mb-4">
              {fileName ? `Selected file: ${fileName}` : "Upload your calendar file (.ics) to get started"}
            </p>
            <Button onClick={triggerFileInput} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {fileName ? "Change File" : "Upload Calendar File"}
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
