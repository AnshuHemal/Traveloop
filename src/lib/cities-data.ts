// ─── Static city database ─────────────────────────────────────────────────────
// Cost index: 1 (very cheap) → 5 (very expensive)
// Popularity: 1 (hidden gem) → 5 (world-famous)

export interface CityData {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  emoji: string;
  description: string;
  costIndex: number;       // 1–5
  popularity: number;      // 1–5
  avgDailyBudget: number;  // USD
  bestMonths: string[];
  tags: string[];
  highlights: string[];
  gradient: string;
}

export const CITIES: CityData[] = [
  // ── Europe ──────────────────────────────────────────────────────────────────
  {
    id: "paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    region: "Europe",
    emoji: "🗼",
    description: "The City of Light — iconic art, cuisine, and romance on the Seine.",
    costIndex: 4,
    popularity: 5,
    avgDailyBudget: 180,
    bestMonths: ["Apr", "May", "Jun", "Sep", "Oct"],
    tags: ["Romance", "Art", "Food", "Fashion", "History"],
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Montmartre"],
    gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    region: "Europe",
    emoji: "🏛️",
    description: "The Eternal City — 2,000 years of history at every corner.",
    costIndex: 3,
    popularity: 5,
    avgDailyBudget: 130,
    bestMonths: ["Apr", "May", "Sep", "Oct"],
    tags: ["History", "Food", "Art", "Architecture", "Culture"],
    highlights: ["Colosseum", "Vatican", "Trevi Fountain", "Roman Forum"],
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    region: "Europe",
    emoji: "🎨",
    description: "Gaudí's masterpieces, beach vibes, and world-class tapas.",
    costIndex: 3,
    popularity: 5,
    avgDailyBudget: 120,
    bestMonths: ["May", "Jun", "Sep", "Oct"],
    tags: ["Architecture", "Beach", "Food", "Nightlife", "Art"],
    highlights: ["Sagrada Família", "Park Güell", "La Rambla", "Gothic Quarter"],
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    region: "Europe",
    emoji: "🌷",
    description: "Canals, cycling culture, world-class museums, and tulip fields.",
    costIndex: 4,
    popularity: 4,
    avgDailyBudget: 150,
    bestMonths: ["Apr", "May", "Jun", "Jul"],
    tags: ["Canals", "Museums", "Cycling", "Culture", "History"],
    highlights: ["Rijksmuseum", "Anne Frank House", "Canal Ring", "Vondelpark"],
    gradient: "from-sky-500/20 via-sky-500/10 to-transparent",
  },
  {
    id: "prague",
    name: "Prague",
    country: "Czech Republic",
    countryCode: "CZ",
    region: "Europe",
    emoji: "🏰",
    description: "A fairy-tale city with medieval architecture and affordable charm.",
    costIndex: 2,
    popularity: 4,
    avgDailyBudget: 80,
    bestMonths: ["May", "Jun", "Sep", "Oct"],
    tags: ["History", "Architecture", "Beer", "Budget", "Culture"],
    highlights: ["Prague Castle", "Charles Bridge", "Old Town Square", "Wenceslas Square"],
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    region: "Europe",
    emoji: "🌊",
    description: "Hilly streets, pastel buildings, fado music, and Atlantic sunsets.",
    costIndex: 2,
    popularity: 4,
    avgDailyBudget: 90,
    bestMonths: ["Mar", "Apr", "May", "Sep", "Oct"],
    tags: ["Culture", "Food", "History", "Budget", "Scenic"],
    highlights: ["Belém Tower", "Alfama District", "Sintra", "Time Out Market"],
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    countryCode: "GR",
    region: "Europe",
    emoji: "🏝️",
    description: "Iconic white-washed cliffs, volcanic beaches, and legendary sunsets.",
    costIndex: 4,
    popularity: 5,
    avgDailyBudget: 200,
    bestMonths: ["May", "Jun", "Sep", "Oct"],
    tags: ["Romance", "Beach", "Scenic", "Luxury", "Photography"],
    highlights: ["Oia Sunset", "Caldera Views", "Red Beach", "Akrotiri"],
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    region: "Europe",
    emoji: "🎡",
    description: "World-class museums, royal history, and a buzzing multicultural scene.",
    costIndex: 5,
    popularity: 5,
    avgDailyBudget: 220,
    bestMonths: ["May", "Jun", "Jul", "Aug", "Sep"],
    tags: ["History", "Museums", "Culture", "Shopping", "Theatre"],
    highlights: ["Big Ben", "British Museum", "Tower of London", "Hyde Park"],
    gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent",
  },

  // ── Asia ─────────────────────────────────────────────────────────────────────
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    region: "Asia",
    emoji: "🗾",
    description: "Ultra-modern meets ancient tradition — the world's most fascinating city.",
    costIndex: 3,
    popularity: 5,
    avgDailyBudget: 140,
    bestMonths: ["Mar", "Apr", "Oct", "Nov"],
    tags: ["Culture", "Food", "Technology", "Anime", "Shopping"],
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tsukiji Market", "Akihabara"],
    gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    countryCode: "ID",
    region: "Asia",
    emoji: "🌴",
    description: "Tropical paradise with rice terraces, temples, and surf culture.",
    costIndex: 1,
    popularity: 5,
    avgDailyBudget: 60,
    bestMonths: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    tags: ["Beach", "Wellness", "Culture", "Budget", "Nature"],
    highlights: ["Ubud Rice Terraces", "Tanah Lot", "Seminyak Beach", "Mount Batur"],
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    region: "Asia",
    emoji: "🏯",
    description: "Street food heaven, ornate temples, and non-stop energy.",
    costIndex: 1,
    popularity: 4,
    avgDailyBudget: 55,
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    tags: ["Food", "Culture", "Budget", "Nightlife", "Shopping"],
    highlights: ["Grand Palace", "Wat Pho", "Chatuchak Market", "Khao San Road"],
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    region: "Asia",
    emoji: "🦁",
    description: "A gleaming city-state where futuristic architecture meets lush gardens.",
    costIndex: 4,
    popularity: 4,
    avgDailyBudget: 160,
    bestMonths: ["Feb", "Mar", "Apr", "Jul", "Aug"],
    tags: ["Modern", "Food", "Shopping", "Gardens", "Culture"],
    highlights: ["Gardens by the Bay", "Marina Bay Sands", "Hawker Centres", "Sentosa"],
    gradient: "from-red-500/20 via-red-500/10 to-transparent",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    countryCode: "AE",
    region: "Middle East",
    emoji: "🏙️",
    description: "Record-breaking skyscrapers, luxury shopping, and desert adventures.",
    costIndex: 4,
    popularity: 4,
    avgDailyBudget: 200,
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    tags: ["Luxury", "Shopping", "Modern", "Desert", "Architecture"],
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"],
    gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    countryCode: "TR",
    region: "Middle East",
    emoji: "🕌",
    description: "Where East meets West — mosques, bazaars, and Bosphorus views.",
    costIndex: 2,
    popularity: 4,
    avgDailyBudget: 75,
    bestMonths: ["Apr", "May", "Sep", "Oct"],
    tags: ["History", "Culture", "Food", "Architecture", "Budget"],
    highlights: ["Hagia Sophia", "Grand Bazaar", "Topkapi Palace", "Bosphorus Cruise"],
    gradient: "from-orange-500/20 via-orange-500/10 to-transparent",
  },

  // ── Americas ──────────────────────────────────────────────────────────────────
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    countryCode: "US",
    region: "Americas",
    emoji: "🗽",
    description: "The city that never sleeps — culture, food, and energy like nowhere else.",
    costIndex: 5,
    popularity: 5,
    avgDailyBudget: 250,
    bestMonths: ["Apr", "May", "Jun", "Sep", "Oct"],
    tags: ["Culture", "Food", "Shopping", "Art", "Nightlife"],
    highlights: ["Central Park", "Times Square", "MoMA", "Brooklyn Bridge"],
    gradient: "from-sky-500/20 via-sky-500/10 to-transparent",
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    region: "Americas",
    emoji: "🌮",
    description: "Ancient Aztec history, world-class food, and vibrant street art.",
    costIndex: 1,
    popularity: 3,
    avgDailyBudget: 50,
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    tags: ["Food", "History", "Culture", "Budget", "Art"],
    highlights: ["Teotihuacán", "Frida Kahlo Museum", "Zócalo", "Xochimilco"],
    gradient: "from-green-500/20 via-green-500/10 to-transparent",
  },
  {
    id: "rio",
    name: "Rio de Janeiro",
    country: "Brazil",
    countryCode: "BR",
    region: "Americas",
    emoji: "🌿",
    description: "Carnival, samba, Christ the Redeemer, and stunning beaches.",
    costIndex: 2,
    popularity: 4,
    avgDailyBudget: 85,
    bestMonths: ["Dec", "Jan", "Feb", "Mar"],
    tags: ["Beach", "Culture", "Nightlife", "Nature", "Carnival"],
    highlights: ["Christ the Redeemer", "Copacabana Beach", "Sugarloaf Mountain", "Carnival"],
    gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
  },

  // ── Africa & Oceania ──────────────────────────────────────────────────────────
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    region: "Oceania",
    emoji: "🦘",
    description: "Iconic harbour, golden beaches, and a laid-back outdoor lifestyle.",
    costIndex: 4,
    popularity: 4,
    avgDailyBudget: 180,
    bestMonths: ["Sep", "Oct", "Nov", "Mar", "Apr"],
    tags: ["Beach", "Nature", "Culture", "Food", "Outdoor"],
    highlights: ["Opera House", "Harbour Bridge", "Bondi Beach", "Blue Mountains"],
    gradient: "from-teal-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    countryCode: "ZA",
    region: "Africa",
    emoji: "🦁",
    description: "Table Mountain, wine country, and some of the world's best beaches.",
    costIndex: 2,
    popularity: 3,
    avgDailyBudget: 80,
    bestMonths: ["Nov", "Dec", "Jan", "Feb", "Mar"],
    tags: ["Nature", "Beach", "Wine", "Adventure", "Scenic"],
    highlights: ["Table Mountain", "Cape of Good Hope", "Robben Island", "Winelands"],
    gradient: "from-orange-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    countryCode: "MA",
    region: "Africa",
    emoji: "🕌",
    description: "Labyrinthine medinas, vibrant souks, and Saharan gateway.",
    costIndex: 1,
    popularity: 3,
    avgDailyBudget: 45,
    bestMonths: ["Mar", "Apr", "Oct", "Nov"],
    tags: ["Culture", "Food", "History", "Budget", "Adventure"],
    highlights: ["Jemaa el-Fna", "Majorelle Garden", "Medina Souks", "Bahia Palace"],
    gradient: "from-red-500/20 via-red-500/10 to-transparent",
  },
];

export const REGIONS = ["All", "Europe", "Asia", "Americas", "Middle East", "Africa", "Oceania"] as const;
export type Region = typeof REGIONS[number];

export const COST_LABELS = ["Any", "Budget", "Moderate", "Comfortable", "Premium", "Luxury"] as const;

export function filterCities(
  cities: CityData[],
  query: string,
  region: string,
  maxCost: number,
  sortBy: string,
): CityData[] {
  let result = [...cities];

  // Search
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q),
    );
  }

  // Region filter
  if (region && region !== "All") {
    result = result.filter((c) => c.region === region);
  }

  // Cost filter
  if (maxCost > 0 && maxCost < 5) {
    result = result.filter((c) => c.costIndex <= maxCost);
  }

  // Sort
  switch (sortBy) {
    case "popularity":
      result.sort((a, b) => b.popularity - a.popularity);
      break;
    case "budget_asc":
      result.sort((a, b) => a.avgDailyBudget - b.avgDailyBudget);
      break;
    case "budget_desc":
      result.sort((a, b) => b.avgDailyBudget - a.avgDailyBudget);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      result.sort((a, b) => b.popularity - a.popularity);
  }

  return result;
}
