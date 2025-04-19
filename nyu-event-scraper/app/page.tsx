import { Suspense } from "react"
import CalendarIntegration from "@/components/calendar-integration"
import EventRecommendations from "@/components/event-recommendations"
import { CalendarSkeleton } from "@/components/skeletons"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">NYU Event Recommender</h1>
        <p className="text-gray-600 mb-8">Connect your calendar to discover NYU events that fit your free time.</p>

        <div className="space-y-8">
          <CalendarIntegration />

          <Suspense fallback={<CalendarSkeleton />}>
            <EventRecommendations />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
