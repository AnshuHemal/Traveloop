# Traveloop

> **Plan trips. Live adventures.**

Traveloop is a full-stack, production-grade travel planning platform. Build multi-city itineraries, track budgets, discover activities, manage packing lists, write trip notes, generate invoices, and share your journey — all in one modern app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| UI Runtime | React 19 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Base UI) |
| Animations | Motion (Framer Motion v12) |
| Authentication | Better Auth v1.6 |
| Database ORM | Prisma 7 |
| Database | PostgreSQL (Neon) |
| Email | Nodemailer + Brevo SMTP |
| Charts | Recharts v3 |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |

---

## Features

### Authentication
- Email + password with OTP email verification (6-char alphanumeric)
- OAuth via Google and GitHub
- Forgot password — 3-step flow (email → OTP → reset)
- Onboarding wizard for new users (traveler type + trip template)
- Route protection via `proxy.ts` + server-side layout guards

### Dashboard
- Personalized greeting with real-time search (trips, cities, activities)
- Stats row (total trips, destinations, completed, in-progress)
- Trip roadmap — horizontal Gantt-style timeline
- Trip status auto-sync (ONGOING when started, COMPLETED suggestion when ended)
- Top destinations, quick actions, budget highlights
- Loading skeletons on all data pages

### Trips
- Create trips with name, dates, currency, visibility, cover photo
- Edit all trip details after creation
- List view with search, filter by status, sort by 7 options
- Grid and list view toggle
- Pagination (load more)
- Duplicate, delete, status change, visibility toggle

### Itinerary Builder
- Add multi-city stops with city search (16 popular cities)
- Set arrival/departure dates and nights per stop
- Drag-to-reorder stops
- Add activities per stop (10 categories, date, time, cost)
- Edit and delete stops and activities
- Inline stop total (activities + expenses combined)

### Itinerary View
- Timeline view — vertical spine with animated connectors
- List view — city-grouped compact layout
- Calendar view — monthly grid with activity dots + day detail panel
- Budget sidebar with category breakdown

### Budget Tracker
- Log expenses per stop (8 categories)
- Recharts PieChart (spending breakdown) + BarChart (by city)
- Category breakdown with animated progress bars
- Per-stop totals (activities + expenses unified)
- Add/delete expenses with confirmation

### Expense Invoice
- Auto-generated invoice from all activities and expenses
- Line items table with category, description, stop, qty, unit cost, amount
- Editable tax rate and discount
- Subtotal / tax / discount / grand total calculation
- Mark as paid, print, share link
- Budget insights card

### Packing Checklist
- 9 categories (Documents, Clothing, Electronics, Toiletries, Health, Money, Entertainment, Food & Snacks, Other)
- Mark items as packed with animated checkbox
- Essential item flagging with star badge
- Quantity support
- Seed with 22 default items
- Search, filter by category, filter packed/unpacked
- Reset all (unpack), clear all, share (copy to clipboard)
- Progress bar with per-category mini-stats

### Trip Notes / Journal
- Create notes with title, content, color (6 options), date, stop link
- Pin notes to float to top
- Group by stop or date
- Sort by newest, oldest, pinned, note date
- Search across title and content
- Edit and delete with animations

### City Search (Explore)
- 20 curated cities across 6 regions
- Filter by region, cost tier, sort by popularity/budget/name
- Grid and list view
- "Add to trip" modal with trip picker
- Star ratings, best months, highlights

### Activity Search
- 20 curated activity templates across 10 categories
- Filter by category, duration, cost tier
- Add directly to trip stops
- Empty state CTA when no stops exist

### Trip Sharing
- Generate public share link (nanoid token)
- Read-only public view at `/t/[token]`
- Revoke link at any time
- Branded not-found page for invalid/revoked links

### Settings
- Profile — update name (real server action)
- Security — change password (real Better Auth API)
- Notifications — toggle preferences
- Appearance — theme picker

### Navigation
- Sticky top nav with user menu
- Mobile bottom tab bar (Dashboard | Trips | Explore | Activities | Settings)
- Trip sub-navigation tabs (Overview | Itinerary | Budget | Invoice | Packing | Notes | Share | Edit)
- Error boundaries at every route segment
- Custom not-found pages throughout

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Login, signup, verify-email, forgot-password
│   ├── (dashboard)/
│   │   ├── dashboard/             # Home dashboard
│   │   ├── trips/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx       # Itinerary builder
│   │   │   │   ├── itinerary/     # Timeline / list / calendar views
│   │   │   │   ├── budget/        # Budget tracker + charts
│   │   │   │   ├── invoice/       # Expense invoice
│   │   │   │   ├── packing/       # Packing checklist
│   │   │   │   ├── notes/         # Trip journal
│   │   │   │   ├── share/         # Share link management
│   │   │   │   └── edit/          # Edit trip details
│   │   │   └── new/               # Create trip wizard
│   │   ├── explore/               # City search
│   │   ├── activities/            # Activity search
│   │   ├── onboarding/            # New user wizard
│   │   └── settings/              # User settings
│   ├── (marketing)/               # Landing page
│   ├── api/
│   │   ├── auth/[...all]/         # Better Auth handler
│   │   └── search/                # Real-time search API
│   └── t/[token]/                 # Public shared trip view
├── components/
│   ├── motion/                    # FadeIn, StaggerChildren
│   ├── providers/                 # ThemeProvider
│   └── shared/                   # Logo, MobileBottomNav, Skeleton
├── lib/
│   ├── auth.ts                    # Better Auth server config
│   ├── auth-client.ts             # Better Auth browser client
│   ├── prisma.ts                  # Prisma singleton
│   ├── session.ts                 # getUser / requireUser
│   ├── currency.ts                # formatCurrency, getCurrencySymbol
│   ├── cities-data.ts             # 20-city database
│   ├── activities-data.ts         # 20-activity template database
│   ├── trip-status.ts             # Auto-sync trip statuses
│   └── email.ts                   # Brevo SMTP email
└── proxy.ts                       # Route protection middleware
```

---

## Database Schema

| Model | Description |
|---|---|
| `User` | Core user (Better Auth) |
| `Session` | Auth sessions |
| `Account` | OAuth provider accounts |
| `Verification` | OTP tokens |
| `Trip` | Travel plan with status, visibility, dates |
| `Stop` | City stop within a trip |
| `Activity` | Activity within a stop |
| `Expense` | Manual expense within a stop |
| `PackingList` | One checklist per trip |
| `PackingItem` | Individual packing item |
| `TripNote` | Journal note linked to trip or stop |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/AnshuHemal/Traveloop.git
cd Traveloop
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

BETTER_AUTH_SECRET=          # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@host:5432/traveloop?sslmode=verify-full

BREVO_SMTP_USER=             # From Brevo SMTP settings
BREVO_SMTP_PASS=             # SMTP key from Brevo
EMAIL_FROM=Traveloop <noreply@yourdomain.com>

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 3. Set up the database

```bash
npx prisma db push
npx prisma generate
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the app |
| `BETTER_AUTH_SECRET` | Yes | Random secret for auth |
| `BETTER_AUTH_URL` | Yes | Must match app URL |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BREVO_SMTP_USER` | Yes | Brevo SMTP login |
| `BREVO_SMTP_PASS` | Yes | Brevo SMTP key |
| `EMAIL_FROM` | Yes | Verified sender email |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth |

---

## Authentication Flow

```
Sign up → OTP email → /onboarding → /dashboard
Sign in → /dashboard
OAuth (Google/GitHub) → /dashboard
Forgot password → OTP → reset → /login
```

---

## License

MIT
