# FinRA — Financial Research Assistant

AI-powered financial research tool built with Next.js, Supabase, and Grok API. Search any stock ticker to get real-time market data, news sentiment analysis, and AI-generated investment insights.

## Tech Stack

- **Frontend:** Next.js 15 + TypeScript (App Router)
- **Database:** Supabase (PostgreSQL)
- **Stock Data:** Finnhub API
- **News Sentiment:** Alpha Vantage API
- **AI Analysis:** xAI Grok API
- **Hosting:** Vercel

## Architecture

```
Client (Next.js)
    ↓
API Routes (server-side)
├── /api/stock/[ticker]      → Finnhub: quote + company profile
├── /api/news/[ticker]       → Finnhub: company news
├── /api/sentiment/[ticker]  → Alpha Vantage: news sentiment
├── /api/analyze             → Grok API: AI investment summary
└── /api/history             → Supabase: past analyses
    ↓
Supabase (PostgreSQL) — stores analysis history
```

All external API calls happen server-side — no API keys are exposed to the client.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone <repo-url>
cd finra
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

You'll need free API keys from:
- [Finnhub](https://finnhub.io/) — stock data
- [Alpha Vantage](https://www.alphavantage.co/support/#api-key) — news sentiment
- [xAI Console](https://console.x.ai/) — Grok AI analysis
- [Supabase](https://supabase.com/) — database

### 3. Set up Supabase

Create a new project in [Supabase](https://supabase.com/dashboard), then run this SQL in the SQL Editor:

```sql
create table analyses (
  id uuid default gen_random_uuid() primary key,
  ticker text not null,
  company_name text not null,
  stock_data jsonb default '{}'::jsonb,
  news_data jsonb default '{}'::jsonb,
  sentiment_data jsonb default '{}'::jsonb,
  ai_summary text not null,
  created_at timestamptz default now()
);

-- Allow anonymous read/insert (RLS policy for demo app)
alter table analyses enable row level security;

create policy "Allow anonymous read" on analyses
  for select using (true);

create policy "Allow anonymous insert" on analyses
  for insert with check (true);
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Real-time stock data** — current price, day range, market cap, and key metrics
- **Company news feed** — recent headlines with source and timestamp
- **Sentiment analysis** — AI-scored sentiment from Alpha Vantage with visual gauge
- **AI investment insights** — Grok-generated analysis covering price action, news, and risks
- **Analysis history** — past analyses stored in Supabase for quick reference
- **Multi-company support** — search and analyze any publicly traded stock

## Database Design

Single table (`analyses`) stores each research session as a denormalized record with JSONB columns for flexibility. This keeps the schema simple while preserving full context of each analysis for review.

## Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

Add the same environment variables from `.env.local` in the Vercel dashboard under Settings → Environment Variables.
