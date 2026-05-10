export const siteConfig = {
  name: "Traveloop",
  tagline: "Plan trips. Live adventures.",
  description:
    "Traveloop is a personalized travel planning platform. Build multi-city itineraries, track budgets, discover activities, and share your journey with the world.",
  shortDescription:
    "Personalized travel planning — build itineraries, track budgets, and share your adventures.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  titleTemplate: "%s | Traveloop",
  keywords: [
    "travel planning",
    "itinerary builder",
    "trip planner",
    "travel budget",
    "multi-city travel",
    "travel app",
    "vacation planner",
    "travel itinerary",
    "trip organizer",
    "travel community",
  ],
  author: {
    name: "Traveloop",
    url: "http://localhost:3000",
  },
  social: {
    twitter: "https://twitter.com/traveloop",
    github: "https://github.com/traveloop",
  },
} as const;

export type SiteConfig = typeof siteConfig;
