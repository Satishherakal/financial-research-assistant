const BASE_URL = "https://finnhub.io/api/v1";

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");
  return key;
}

export interface StockQuote {
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  timestamp: number;
}

export interface CompanyProfile {
  name: string;
  ticker: string;
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCap: number;
  industry: string;
  logo: string;
  weburl: string;
  finnhubIndustry: string;
}

export interface NewsArticle {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export async function getQuote(ticker: string): Promise<StockQuote> {
  const res = await fetch(
    `${BASE_URL}/quote?symbol=${encodeURIComponent(ticker)}&token=${getApiKey()}`
  );

  if (!res.ok) throw new Error(`Finnhub quote request failed: ${res.status}`);

  const data = await res.json();

  return {
    currentPrice: data.c,
    change: data.d,
    percentChange: data.dp,
    highPrice: data.h,
    lowPrice: data.l,
    openPrice: data.o,
    previousClose: data.pc,
    timestamp: data.t,
  };
}

export async function getCompanyProfile(
  ticker: string
): Promise<CompanyProfile> {
  const res = await fetch(
    `${BASE_URL}/stock/profile2?symbol=${encodeURIComponent(ticker)}&token=${getApiKey()}`
  );

  if (!res.ok) throw new Error(`Finnhub profile request failed: ${res.status}`);

  const data = await res.json();

  return {
    name: data.name || ticker,
    ticker: data.ticker || ticker,
    country: data.country || "",
    currency: data.currency || "USD",
    exchange: data.exchange || "",
    ipo: data.ipo || "",
    marketCap: data.marketCapitalization || 0,
    industry: data.finnhubIndustry || "",
    logo: data.logo || "",
    weburl: data.weburl || "",
    finnhubIndustry: data.finnhubIndustry || "",
  };
}

export async function getCompanyNews(
  ticker: string
): Promise<NewsArticle[]> {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const res = await fetch(
    `${BASE_URL}/company-news?symbol=${encodeURIComponent(ticker)}&from=${fmt(from)}&to=${fmt(to)}&token=${getApiKey()}`
  );

  if (!res.ok) throw new Error(`Finnhub news request failed: ${res.status}`);

  const data = await res.json();

  return (data as NewsArticle[]).slice(0, 10);
}
