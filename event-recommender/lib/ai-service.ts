// This service simulates AI-generated categories and mood tags for events

// Predefined categories for events
const EVENT_CATEGORIES = [
  "Academic",
  "Arts & Culture",
  "Career",
  "Community Service",
  "Entertainment",
  "Fitness & Wellness",
  "Food & Dining",
  "Networking",
  "Social",
  "Sports",
  "Technology",
  "Workshop",
]

// Predefined mood tags for events
const EVENT_MOODS = [
  "Exciting",
  "Relaxing",
  "Inspiring",
  "Informative",
  "Challenging",
  "Fun",
  "Serious",
  "Creative",
  "Collaborative",
  "Competitive",
  "Reflective",
  "Energetic",
]

// Function to generate a category based on event title and description
export function generateCategory(title: string, description = ""): string {
  const text = `${title} ${description}`.toLowerCase()

  // Simple keyword matching for categories
  if (text.includes("lecture") || text.includes("seminar") || text.includes("research") || text.includes("academic")) {
    return "Academic"
  }

  if (
    text.includes("art") ||
    text.includes("music") ||
    text.includes("theater") ||
    text.includes("exhibition") ||
    text.includes("performance") ||
    text.includes("concert") ||
    text.includes("gallery")
  ) {
    return "Arts & Culture"
  }

  if (
    text.includes("career") ||
    text.includes("job") ||
    text.includes("interview") ||
    text.includes("resume") ||
    text.includes("professional") ||
    text.includes("industry")
  ) {
    return "Career"
  }

  if (
    text.includes("volunteer") ||
    text.includes("community") ||
    text.includes("service") ||
    text.includes("charity")
  ) {
    return "Community Service"
  }

  if (
    text.includes("movie") ||
    text.includes("film") ||
    text.includes("show") ||
    text.includes("entertainment") ||
    text.includes("comedy") ||
    text.includes("party")
  ) {
    return "Entertainment"
  }

  if (
    text.includes("fitness") ||
    text.includes("yoga") ||
    text.includes("health") ||
    text.includes("wellness") ||
    text.includes("meditation") ||
    text.includes("workout")
  ) {
    return "Fitness & Wellness"
  }

  if (
    text.includes("food") ||
    text.includes("dinner") ||
    text.includes("lunch") ||
    text.includes("breakfast") ||
    text.includes("cuisine") ||
    text.includes("tasting")
  ) {
    return "Food & Dining"
  }

  if (text.includes("network") || text.includes("connect") || text.includes("mixer") || text.includes("meetup")) {
    return "Networking"
  }

  if (text.includes("social") || text.includes("club") || text.includes("gathering") || text.includes("meet")) {
    return "Social"
  }

  if (
    text.includes("sport") ||
    text.includes("game") ||
    text.includes("match") ||
    text.includes("tournament") ||
    text.includes("athletic") ||
    text.includes("basketball") ||
    text.includes("soccer") ||
    text.includes("football")
  ) {
    return "Sports"
  }

  if (
    text.includes("tech") ||
    text.includes("coding") ||
    text.includes("programming") ||
    text.includes("software") ||
    text.includes("data") ||
    text.includes("ai") ||
    text.includes("computer")
  ) {
    return "Technology"
  }

  if (text.includes("workshop") || text.includes("training") || text.includes("hands-on") || text.includes("learn")) {
    return "Workshop"
  }

  // If no match found, use a deterministic but seemingly random category based on the title
  const titleHash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return EVENT_CATEGORIES[titleHash % EVENT_CATEGORIES.length]
}

// Function to generate mood tags based on event title, category, and description
export function generateMoodTags(title: string, category: string, description = ""): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const moods: string[] = []

  // Add mood tags based on content
  if (
    text.includes("fun") ||
    text.includes("exciting") ||
    text.includes("party") ||
    text.includes("celebration") ||
    category === "Entertainment" ||
    category === "Social"
  ) {
    moods.push("Fun")
  }

  if (
    text.includes("learn") ||
    text.includes("education") ||
    text.includes("workshop") ||
    text.includes("seminar") ||
    category === "Academic" ||
    category === "Workshop"
  ) {
    moods.push("Informative")
  }

  if (
    text.includes("inspire") ||
    text.includes("motivate") ||
    text.includes("creative") ||
    text.includes("innovation") ||
    category === "Arts & Culture"
  ) {
    moods.push("Inspiring")
  }

  if (text.includes("relax") || text.includes("chill") || text.includes("calm") || category === "Fitness & Wellness") {
    moods.push("Relaxing")
  }

  if (text.includes("challenge") || text.includes("competition") || text.includes("contest") || category === "Sports") {
    moods.push("Challenging")
  }

  if (
    text.includes("collaborate") ||
    text.includes("team") ||
    text.includes("group") ||
    category === "Community Service" ||
    category === "Networking"
  ) {
    moods.push("Collaborative")
  }

  if (
    text.includes("energy") ||
    text.includes("active") ||
    text.includes("dynamic") ||
    category === "Sports" ||
    category === "Fitness & Wellness"
  ) {
    moods.push("Energetic")
  }

  if (
    text.includes("social") ||
    text.includes("network") ||
    text.includes("meet") ||
    text.includes("connect") ||
    category === "Networking" ||
    category === "Social"
  ) {
    moods.push("Social")
  }

  if (
    text.includes("creative") ||
    text.includes("art") ||
    text.includes("design") ||
    text.includes("innovation") ||
    category === "Arts & Culture"
  ) {
    moods.push("Creative")
  }

  if (
    text.includes("professional") ||
    text.includes("career") ||
    text.includes("industry") ||
    text.includes("business") ||
    category === "Career"
  ) {
    moods.push("Professional")
  }

  if (
    text.includes("intellectual") ||
    text.includes("think") ||
    text.includes("discussion") ||
    text.includes("debate") ||
    category === "Academic"
  ) {
    moods.push("Intellectual")
  }

  // If we have fewer than 2 moods, add some based on category
  if (moods.length < 2) {
    if (category === "Academic" && !moods.includes("Intellectual")) {
      moods.push("Intellectual")
    }
    if (category === "Arts & Culture" && !moods.includes("Creative")) {
      moods.push("Creative")
    }
    if (category === "Career" && !moods.includes("Professional")) {
      moods.push("Professional")
    }
    if (category === "Community Service" && !moods.includes("Fulfilling")) {
      moods.push("Fulfilling")
    }
    if (category === "Entertainment" && !moods.includes("Fun")) {
      moods.push("Fun")
    }
    if (category === "Fitness & Wellness" && !moods.includes("Energetic")) {
      moods.push("Energetic")
    }
    if (category === "Food & Dining" && !moods.includes("Satisfying")) {
      moods.push("Satisfying")
    }
    if (category === "Networking" && !moods.includes("Social")) {
      moods.push("Social")
    }
    if (category === "Social" && !moods.includes("Fun")) {
      moods.push("Fun")
    }
    if (category === "Sports" && !moods.includes("Competitive")) {
      moods.push("Competitive")
    }
    if (category === "Technology" && !moods.includes("Innovative")) {
      moods.push("Innovative")
    }
    if (category === "Workshop" && !moods.includes("Hands-on")) {
      moods.push("Hands-on")
    }
  }

  // If we still have fewer than 3 moods, add some deterministic but seemingly random moods
  if (moods.length < 3) {
    const titleHash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const additionalMoods = EVENT_MOODS.filter((mood) => !moods.includes(mood))

    for (let i = 0; moods.length < 5 && i < additionalMoods.length; i++) {
      const index = (titleHash + i) % additionalMoods.length
      moods.push(additionalMoods[index])
    }
  }

  // Remove duplicates and limit to 5 moods maximum
  return [...new Set(moods)].slice(0, 5)
}

// Get all available mood tags for filtering
export function getAllMoodTags(): string[] {
  return EVENT_MOODS
}
