"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import SearchBar from "@/components/SearchBar";
import StockOverview from "@/components/StockOverview";
import NewsFeed from "@/components/NewsFeed";
import SentimentGauge from "@/components/SentimentGauge";
import AIAnalysis from "@/components/AIAnalysis";
import HistoryPanel from "@/components/HistoryPanel";
import LoadingState from "@/components/LoadingState";

interface StockData {
  quote: {
    currentPrice: number;
    change: number;
    percentChange: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    previousClose: number;
  };
  profile: {
    name: string;
    ticker: string;
    industry: string;
    exchange: string;
    marketCap: number;
    logo: string;
    country: string;
    currency: string;
  };
}

interface NewsArticle {
  headline: string;
  source: string;
  url: string;
  datetime: number;
  image: string;
  summary: string;
}

interface SentimentData {
  averageScore: number;
  overallLabel: string;
  articles: {
    title: string;
    tickerSentimentLabel: string;
    tickerSentimentScore: number;
  }[];
}

interface HistoryEntry {
  id: string;
  ticker: string;
  company_name: string;
  created_at: string;
}

export default function Home() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(
    null
  );
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState<string>("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data.history || []);
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  const handleSearch = useCallback(async (ticker: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setCurrentTicker(ticker);

    try {
      const [stockRes, newsRes, sentimentRes] = await Promise.all([
        fetch(`/api/stock/${encodeURIComponent(ticker)}`),
        fetch(`/api/news/${encodeURIComponent(ticker)}`),
        fetch(`/api/sentiment/${encodeURIComponent(ticker)}`),
      ]);

      if (!stockRes.ok) {
        const errData = await stockRes.json();
        throw new Error(errData.error || "Failed to fetch stock data");
      }

      const stock = await stockRes.json();
      const news = await newsRes.json();
      const sentiment = await sentimentRes.json();

      setStockData(stock);
      setNewsData(news.articles || []);
      setSentimentData(
        sentiment.error ? null : sentiment
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Check the ticker and try again."
      );
      setStockData(null);
      setNewsData([]);
      setSentimentData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerateAnalysis = async () => {
    if (!stockData) return;

    setAnalysisLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: currentTicker,
          companyName: stockData.profile.name,
          stockData: stockData.quote,
          newsData: { articles: newsData },
          sentimentData,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate analysis");

      const data = await res.json();
      setAnalysis(data.analysis);
      fetchHistory();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate AI analysis"
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleHistorySelect = (ticker: string) => {
    handleSearch(ticker);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1 className={styles.logo}>
            Fin<span className={styles.logoAccent}>RA</span>
          </h1>
        </div>
        <p className={styles.tagline}>
          AI-powered financial research — real-time data, sentiment analysis,
          and investment insights
        </p>
      </header>

      <div className={styles.searchSection}>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.layout}>
        <div className={styles.main}>
          {loading && <LoadingState />}

          {!loading && !stockData && !error && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <div className={styles.emptyTitle}>Search for a stock</div>
              <p className={styles.emptyText}>
                Enter a ticker symbol like AAPL, TSLA, or MSFT to get real-time
                market data, news, sentiment analysis, and AI-generated
                investment insights.
              </p>
            </div>
          )}

          {!loading && stockData && (
            <>
              <StockOverview
                profile={stockData.profile}
                quote={stockData.quote}
              />

              <div className={styles.dataGrid}>
                <NewsFeed articles={newsData} />
                {sentimentData && (
                  <SentimentGauge
                    averageScore={sentimentData.averageScore}
                    overallLabel={sentimentData.overallLabel}
                    articles={sentimentData.articles}
                  />
                )}
              </div>

              <AIAnalysis
                analysis={analysis}
                loading={analysisLoading}
                onGenerate={handleGenerateAnalysis}
                hasData={!!stockData}
              />
            </>
          )}
        </div>

        <aside className={styles.sidebar}>
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
          />
        </aside>
      </div>
    </div>
  );
}
