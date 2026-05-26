# ProvenSkills

The secure marketplace for AI agent skills. Every skill is security-certified before you install.

## Features

- **12-Point Security Certification** - Every skill passes comprehensive security scanning
- **80% Creator Revenue** - Creators keep the majority of every sale
- **One-Command Install** - Install any skill with a single command
- **MCP Server Support** - Browse and discover MCP servers alongside skills

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: HeroUI + Tailwind CSS v4
- **State**: Zustand + TanStack Query
- **Database**: Supabase (Postgres)
- **Payments**: Stripe Connect
- **Auth**: Supabase Auth (GitHub OAuth)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/provenskills.git
cd provenskills

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/                # Next.js app router pages
├── components/
│   ├── layout/        # Header, Footer, Layout components
│   ├── ui/            # Reusable UI components
│   └── skills/        # Skills-specific components
├── lib/               # Utilities and helpers
├── hooks/             # Custom React hooks
├── stores/            # Zustand stores
├── types/             # TypeScript type definitions
└── config/            # Configuration files
```

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler
```

## License

MIT
