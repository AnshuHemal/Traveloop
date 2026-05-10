

export type ActivityCategory =
  | "SIGHTSEEING" | "FOOD" | "TRANSPORT" | "ACCOMMODATION"
  | "ADVENTURE" | "CULTURE" | "SHOPPING" | "NIGHTLIFE" | "WELLNESS" | "OTHER";

export type DurationRange = "0-1h" | "1-3h" | "3-6h" | "full-day" | "multi-day";
export type CostTier = "free" | "budget" | "moderate" | "premium" | "luxury";

export interface ActivityTemplate {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  emoji: string;
  durationRange: DurationRange;
  durationLabel: string;
  costTier: CostTier;
  avgCost: number;
  rating: number;
  tags: string[];
  cities: string[];
  highlights: string[];
  tips: string;
  gradient: string;
  popular: boolean;
}

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [

  {
    id: "city-walking-tour",
    name: "City Walking Tour",
    category: "SIGHTSEEING",
    description: "Explore the city's most iconic landmarks and hidden gems on foot with a local guide.",
    emoji: "🚶",
    durationRange: "3-6h",
    durationLabel: "3–4 hours",
    costTier: "budget",
    avgCost: 25,
    rating: 4.8,
    tags: ["Walking", "History", "Local Guide", "Landmarks"],
    cities: [],
    highlights: ["Historic landmarks", "Local neighborhoods", "Photo spots", "Hidden gems"],
    tips: "Wear comfortable shoes and bring water. Morning tours avoid crowds.",
    gradient: "from-primary/15 via-primary/8 to-transparent",
    popular: true,
  },
  {
    id: "sunset-viewpoint",
    name: "Sunset Viewpoint",
    category: "SIGHTSEEING",
    description: "Watch the golden hour from the city's best vantage point — a memory you'll never forget.",
    emoji: "🌅",
    durationRange: "1-3h",
    durationLabel: "1–2 hours",
    costTier: "free",
    avgCost: 0,
    rating: 4.9,
    tags: ["Sunset", "Photography", "Romantic", "Views"],
    cities: ["santorini", "lisbon", "cape-town"],
    highlights: ["Golden hour light", "Panoramic views", "Photography"],
    tips: "Arrive 30 minutes early to get the best spot. Bring a jacket — it gets cool.",
    gradient: "from-orange-500/15 via-orange-500/8 to-transparent",
    popular: true,
  },
  {
    id: "museum-visit",
    name: "World-Class Museum",
    category: "CULTURE",
    description: "Immerse yourself in art, history, or science at one of the city's premier museums.",
    emoji: "🏛️",
    durationRange: "3-6h",
    durationLabel: "2–4 hours",
    costTier: "moderate",
    avgCost: 20,
    rating: 4.6,
    tags: ["Art", "History", "Culture", "Indoor"],
    cities: ["paris", "london", "new-york", "amsterdam"],
    highlights: ["World-famous collections", "Guided audio tours", "Café on-site"],
    tips: "Book tickets online to skip the queue. Visit on weekday mornings for fewer crowds.",
    gradient: "from-violet-500/15 via-violet-500/8 to-transparent",
    popular: true,
  },
  {
    id: "boat-cruise",
    name: "Scenic Boat Cruise",
    category: "SIGHTSEEING",
    description: "See the city from the water — canals, harbours, or rivers offer a completely different perspective.",
    emoji: "⛵",
    durationRange: "1-3h",
    durationLabel: "1–3 hours",
    costTier: "moderate",
    avgCost: 35,
    rating: 4.7,
    tags: ["Water", "Scenic", "Relaxing", "Photography"],
    cities: ["amsterdam", "istanbul", "sydney", "rio"],
    highlights: ["Waterfront views", "City skyline", "Sunset option"],
    tips: "Evening cruises often include dinner. Book in advance during peak season.",
    gradient: "from-sky-500/15 via-sky-500/8 to-transparent",
    popular: true,
  },

  {
    id: "food-tour",
    name: "Street Food Tour",
    category: "FOOD",
    description: "Taste your way through the city's best street food stalls, markets, and local eateries.",
    emoji: "🍜",
    durationRange: "3-6h",
    durationLabel: "3–4 hours",
    costTier: "moderate",
    avgCost: 45,
    rating: 4.9,
    tags: ["Food", "Local", "Street Food", "Culture"],
    cities: ["bangkok", "tokyo", "mexico-city", "marrakech"],
    highlights: ["10+ tastings", "Local guide", "Hidden spots", "Market visit"],
    tips: "Come hungry! Skip breakfast. Vegetarian options usually available on request.",
    gradient: "from-amber-500/15 via-amber-500/8 to-transparent",
    popular: true,
  },
  {
    id: "cooking-class",
    name: "Local Cooking Class",
    category: "FOOD",
    description: "Learn to cook authentic local dishes from a professional chef in a hands-on class.",
    emoji: "👨‍🍳",
    durationRange: "3-6h",
    durationLabel: "3–4 hours",
    costTier: "moderate",
    avgCost: 65,
    rating: 4.8,
    tags: ["Cooking", "Hands-on", "Culture", "Food"],
    cities: ["paris", "rome", "bangkok", "tokyo"],
    highlights: ["Market visit", "3-course meal", "Recipe booklet", "Wine pairing"],
    tips: "Book at least 2 days in advance. Most classes include a market visit.",
    gradient: "from-amber-500/15 via-amber-500/8 to-transparent",
    popular: false,
  },
  {
    id: "fine-dining",
    name: "Fine Dining Experience",
    category: "FOOD",
    description: "Indulge in a world-class tasting menu at one of the city's top-rated restaurants.",
    emoji: "🍷",
    durationRange: "3-6h",
    durationLabel: "2–3 hours",
    costTier: "luxury",
    avgCost: 150,
    rating: 4.7,
    tags: ["Fine Dining", "Luxury", "Wine", "Special Occasion"],
    cities: ["paris", "london", "new-york", "tokyo"],
    highlights: ["Tasting menu", "Sommelier service", "Michelin-starred"],
    tips: "Reserve weeks in advance. Smart casual dress code typically required.",
    gradient: "from-rose-500/15 via-rose-500/8 to-transparent",
    popular: false,
  },
  {
    id: "local-market",
    name: "Local Food Market",
    category: "FOOD",
    description: "Browse fresh produce, local delicacies, and artisan goods at a vibrant local market.",
    emoji: "🛒",
    durationRange: "1-3h",
    durationLabel: "1–2 hours",
    costTier: "free",
    avgCost: 10,
    rating: 4.5,
    tags: ["Market", "Local", "Food", "Shopping"],
    cities: [],
    highlights: ["Fresh produce", "Local vendors", "Street snacks", "Souvenirs"],
    tips: "Go in the morning for the freshest produce. Bring cash — many vendors don't take cards.",
    gradient: "from-green-500/15 via-green-500/8 to-transparent",
    popular: false,
  },

  {
    id: "hiking",
    name: "Scenic Hiking Trail",
    category: "ADVENTURE",
    description: "Trek through stunning landscapes with panoramic views of the surrounding area.",
    emoji: "🥾",
    durationRange: "3-6h",
    durationLabel: "4–6 hours",
    costTier: "free",
    avgCost: 0,
    rating: 4.8,
    tags: ["Hiking", "Nature", "Views", "Active"],
    cities: ["cape-town", "santorini", "sydney", "bali"],
    highlights: ["Panoramic views", "Wildlife spotting", "Photo opportunities"],
    tips: "Start early to avoid heat. Bring plenty of water and sunscreen.",
    gradient: "from-emerald-500/15 via-emerald-500/8 to-transparent",
    popular: true,
  },
  {
    id: "surfing",
    name: "Surfing Lesson",
    category: "ADVENTURE",
    description: "Catch your first wave with a professional instructor on one of the world's best surf beaches.",
    emoji: "🏄",
    durationRange: "3-6h",
    durationLabel: "2–3 hours",
    costTier: "moderate",
    avgCost: 55,
    rating: 4.7,
    tags: ["Surfing", "Beach", "Active", "Beginner-friendly"],
    cities: ["bali", "sydney", "rio", "lisbon"],
    highlights: ["Equipment included", "Professional instructor", "Beginner-friendly"],
    tips: "No experience needed. Morning sessions have calmer waves for beginners.",
    gradient: "from-sky-500/15 via-sky-500/8 to-transparent",
    popular: false,
  },
  {
    id: "desert-safari",
    name: "Desert Safari",
    category: "ADVENTURE",
    description: "Experience the magic of the desert — dune bashing, camel rides, and a Bedouin dinner.",
    emoji: "🐪",
    durationRange: "full-day",
    durationLabel: "6–8 hours",
    costTier: "premium",
    avgCost: 90,
    rating: 4.8,
    tags: ["Desert", "Adventure", "Cultural", "Sunset"],
    cities: ["dubai", "marrakech"],
    highlights: ["Dune bashing", "Camel ride", "Bedouin camp", "Dinner show"],
    tips: "Evening safaris include dinner and entertainment. Wear light, loose clothing.",
    gradient: "from-yellow-500/15 via-yellow-500/8 to-transparent",
    popular: true,
  },
  {
    id: "scuba-diving",
    name: "Scuba Diving",
    category: "ADVENTURE",
    description: "Explore vibrant coral reefs and marine life beneath the surface.",
    emoji: "🤿",
    durationRange: "3-6h",
    durationLabel: "3–4 hours",
    costTier: "premium",
    avgCost: 80,
    rating: 4.9,
    tags: ["Diving", "Ocean", "Marine Life", "Adventure"],
    cities: ["bali", "santorini", "sydney"],
    highlights: ["Coral reefs", "Marine life", "Equipment included", "Certified instructor"],
    tips: "Beginners can do a discover scuba session. Book in advance during peak season.",
    gradient: "from-cyan-500/15 via-cyan-500/8 to-transparent",
    popular: false,
  },

  {
    id: "temple-visit",
    name: "Temple & Shrine Visit",
    category: "CULTURE",
    description: "Discover ancient spiritual sites, intricate architecture, and centuries of tradition.",
    emoji: "⛩️",
    durationRange: "1-3h",
    durationLabel: "1–2 hours",
    costTier: "free",
    avgCost: 5,
    rating: 4.7,
    tags: ["Spiritual", "History", "Architecture", "Culture"],
    cities: ["tokyo", "bangkok", "bali", "istanbul"],
    highlights: ["Ancient architecture", "Spiritual atmosphere", "Photography"],
    tips: "Dress modestly — cover shoulders and knees. Remove shoes when required.",
    gradient: "from-orange-500/15 via-orange-500/8 to-transparent",
    popular: true,
  },
  {
    id: "live-music",
    name: "Live Music & Performance",
    category: "CULTURE",
    description: "Experience the city's vibrant music scene — from jazz clubs to flamenco shows.",
    emoji: "🎭",
    durationRange: "1-3h",
    durationLabel: "2–3 hours",
    costTier: "moderate",
    avgCost: 40,
    rating: 4.6,
    tags: ["Music", "Entertainment", "Nightlife", "Culture"],
    cities: ["barcelona", "lisbon", "rio", "new-york"],
    highlights: ["Live performance", "Local artists", "Authentic atmosphere"],
    tips: "Book in advance for popular shows. Arrive early for the best seats.",
    gradient: "from-rose-500/15 via-rose-500/8 to-transparent",
    popular: false,
  },
  {
    id: "art-gallery",
    name: "Contemporary Art Gallery",
    category: "CULTURE",
    description: "Explore cutting-edge contemporary art in one of the city's most exciting galleries.",
    emoji: "🎨",
    durationRange: "1-3h",
    durationLabel: "1–2 hours",
    costTier: "budget",
    avgCost: 15,
    rating: 4.4,
    tags: ["Art", "Contemporary", "Culture", "Indoor"],
    cities: ["london", "new-york", "paris", "amsterdam"],
    highlights: ["Contemporary exhibitions", "Local artists", "Gift shop"],
    tips: "Many galleries have free entry on certain days. Check the website before visiting.",
    gradient: "from-pink-500/15 via-pink-500/8 to-transparent",
    popular: false,
  },

  {
    id: "spa-day",
    name: "Traditional Spa & Massage",
    category: "WELLNESS",
    description: "Rejuvenate with a traditional massage or spa treatment using local techniques.",
    emoji: "🧘",
    durationRange: "1-3h",
    durationLabel: "1–3 hours",
    costTier: "moderate",
    avgCost: 60,
    rating: 4.8,
    tags: ["Spa", "Relaxation", "Wellness", "Massage"],
    cities: ["bali", "bangkok", "istanbul"],
    highlights: ["Traditional techniques", "Aromatherapy", "Steam room"],
    tips: "Book in advance. Arrive 15 minutes early to enjoy the facilities.",
    gradient: "from-teal-500/15 via-teal-500/8 to-transparent",
    popular: true,
  },
  {
    id: "yoga-class",
    name: "Yoga & Meditation",
    category: "WELLNESS",
    description: "Start your day with a sunrise yoga session or guided meditation in a serene setting.",
    emoji: "🌿",
    durationRange: "1-3h",
    durationLabel: "1–2 hours",
    costTier: "budget",
    avgCost: 20,
    rating: 4.7,
    tags: ["Yoga", "Meditation", "Wellness", "Morning"],
    cities: ["bali", "india"],
    highlights: ["Sunrise sessions", "All levels welcome", "Equipment provided"],
    tips: "Morning classes are most popular. Book the day before.",
    gradient: "from-emerald-500/15 via-emerald-500/8 to-transparent",
    popular: false,
  },

  {
    id: "bazaar-shopping",
    name: "Grand Bazaar & Souks",
    category: "SHOPPING",
    description: "Lose yourself in a labyrinth of stalls selling spices, textiles, jewellery, and crafts.",
    emoji: "🛍️",
    durationRange: "3-6h",
    durationLabel: "2–4 hours",
    costTier: "budget",
    avgCost: 30,
    rating: 4.5,
    tags: ["Shopping", "Souvenirs", "Culture", "Bargaining"],
    cities: ["istanbul", "marrakech", "bangkok"],
    highlights: ["Handmade crafts", "Spice markets", "Bargaining culture"],
    tips: "Bargaining is expected and part of the culture. Start at 50% of the asking price.",
    gradient: "from-amber-500/15 via-amber-500/8 to-transparent",
    popular: false,
  },
  {
    id: "luxury-shopping",
    name: "Luxury Shopping District",
    category: "SHOPPING",
    description: "Browse flagship stores of the world's top luxury brands in the city's premier shopping area.",
    emoji: "💎",
    durationRange: "3-6h",
    durationLabel: "2–4 hours",
    costTier: "luxury",
    avgCost: 200,
    rating: 4.3,
    tags: ["Luxury", "Fashion", "Shopping", "Premium"],
    cities: ["paris", "london", "dubai", "new-york"],
    highlights: ["Designer boutiques", "Personal shopping", "Flagship stores"],
    tips: "Many stores offer tax refunds for tourists. Keep your receipts.",
    gradient: "from-violet-500/15 via-violet-500/8 to-transparent",
    popular: false,
  },

  {
    id: "rooftop-bar",
    name: "Rooftop Bar & Cocktails",
    category: "NIGHTLIFE",
    description: "Sip cocktails with a stunning city skyline view from a rooftop bar.",
    emoji: "🌃",
    durationRange: "1-3h",
    durationLabel: "2–3 hours",
    costTier: "premium",
    avgCost: 50,
    rating: 4.6,
    tags: ["Cocktails", "Views", "Nightlife", "Social"],
    cities: ["singapore", "dubai", "new-york", "bangkok"],
    highlights: ["City skyline views", "Craft cocktails", "Sunset timing"],
    tips: "Arrive at sunset for the best experience. Smart casual dress code.",
    gradient: "from-indigo-500/15 via-indigo-500/8 to-transparent",
    popular: true,
  },
  {
    id: "night-market",
    name: "Night Market",
    category: "NIGHTLIFE",
    description: "Experience the city after dark at a vibrant night market full of food, crafts, and entertainment.",
    emoji: "🏮",
    durationRange: "1-3h",
    durationLabel: "2–3 hours",
    costTier: "budget",
    avgCost: 15,
    rating: 4.7,
    tags: ["Night Market", "Food", "Shopping", "Local"],
    cities: ["bangkok", "tokyo", "singapore", "marrakech"],
    highlights: ["Street food", "Live entertainment", "Local crafts"],
    tips: "Go after 8pm when it's in full swing. Bring cash.",
    gradient: "from-orange-500/15 via-orange-500/8 to-transparent",
    popular: true,
  },
];

export const ACTIVITY_CATEGORIES: { value: ActivityCategory | "ALL"; label: string; emoji: string }[] = [
  { value: "ALL",           label: "All",           emoji: "✨" },
  { value: "SIGHTSEEING",   label: "Sightseeing",   emoji: "🏛️" },
  { value: "FOOD",          label: "Food",          emoji: "🍜" },
  { value: "ADVENTURE",     label: "Adventure",     emoji: "🧗" },
  { value: "CULTURE",       label: "Culture",       emoji: "🎭" },
  { value: "WELLNESS",      label: "Wellness",      emoji: "🧘" },
  { value: "SHOPPING",      label: "Shopping",      emoji: "🛍️" },
  { value: "NIGHTLIFE",     label: "Nightlife",     emoji: "🌃" },
];

export const DURATION_OPTIONS: { value: DurationRange | "ALL"; label: string }[] = [
  { value: "ALL",       label: "Any duration" },
  { value: "0-1h",      label: "Under 1 hour" },
  { value: "1-3h",      label: "1–3 hours" },
  { value: "3-6h",      label: "3–6 hours" },
  { value: "full-day",  label: "Full day" },
  { value: "multi-day", label: "Multi-day" },
];

export const COST_TIER_OPTIONS: { value: CostTier | "ALL"; label: string; color: string }[] = [
  { value: "ALL",      label: "Any cost",  color: "" },
  { value: "free",     label: "Free",      color: "text-emerald-600 dark:text-emerald-400" },
  { value: "budget",   label: "Budget",    color: "text-primary" },
  { value: "moderate", label: "Moderate",  color: "text-amber-600 dark:text-amber-400" },
  { value: "premium",  label: "Premium",   color: "text-orange-600 dark:text-orange-400" },
  { value: "luxury",   label: "Luxury",    color: "text-rose-600 dark:text-rose-400" },
];

export const COST_TIER_LABELS: Record<CostTier, string> = {
  free:     "Free",
  budget:   "$",
  moderate: "$$",
  premium:  "$$$",
  luxury:   "$$$$",
};

export const COST_TIER_COLORS: Record<CostTier, string> = {
  free:     "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  budget:   "text-primary bg-primary/10",
  moderate: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  premium:  "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  luxury:   "text-rose-600 dark:text-rose-400 bg-rose-500/10",
};

export function filterActivities(
  activities: ActivityTemplate[],
  query: string,
  category: string,
  duration: string,
  costTier: string,
  sortBy: string,
  cityId?: string,
): ActivityTemplate[] {
  let result = [...activities];

  if (cityId) {
    result = result.filter(
      (a) => a.cities.length === 0 || a.cities.includes(cityId),
    );
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q),
    );
  }

  if (category && category !== "ALL") {
    result = result.filter((a) => a.category === category);
  }

  if (duration && duration !== "ALL") {
    result = result.filter((a) => a.durationRange === duration);
  }

  if (costTier && costTier !== "ALL") {
    result = result.filter((a) => a.costTier === costTier);
  }

  switch (sortBy) {
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "cost_asc":
      result.sort((a, b) => a.avgCost - b.avgCost);
      break;
    case "cost_desc":
      result.sort((a, b) => b.avgCost - a.avgCost);
      break;
    case "duration_asc": {
      const order = ["0-1h", "1-3h", "3-6h", "full-day", "multi-day"];
      result.sort((a, b) => order.indexOf(a.durationRange) - order.indexOf(b.durationRange));
      break;
    }
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:

      result.sort((a, b) => {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        return b.rating - a.rating;
      });
  }

  return result;
}
