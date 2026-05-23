const BASE_URL = "https://www.alphavantage.co/query";

function getApiKey(): string {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) throw new Error("ALPHA_VANTAGE_API_KEY is not set");
  return key;
}

export interface SentimentArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  overallSentimentScore: number;
  overallSentimentLabel: string;
  tickerSentimentScore: number;
  tickerSentimentLabel: string;
}

export interface SentimentResult {
  articles: SentimentArticle[];
  averageScore: number;
  overallLabel: string;
}

export async function getNewsSentiment(
  ticker: string
): Promise<SentimentResult> {
  const res = await fetch(
    `${BASE_URL}?function=NEWS_SENTIMENT&tickers=${encodeURIComponent(ticker)}&apikey=${getApiKey()}&limit=10`
  );

  if (!res.ok)
    throw new Error(`Alpha Vantage sentiment request failed: ${res.status}`);

  const data = await res.json();

  if (data["Note"] || data["Information"] || !data.feed) {
    return {
      articles: [],
      averageScore: 0,
      overallLabel: "Neutral",
    };
  }

  const articles: SentimentArticle[] = data.feed.map(
    (item: Record<string, unknown>) => {
      const tickerSentiment = (
        item.ticker_sentiment as Array<{
          ticker: string;
          ticker_sentiment_score: string;
          ticker_sentiment_label: string;
        }>
      )?.find(
        (ts) => ts.ticker.toUpperCase() === ticker.toUpperCase()
      );

      return {
        title: item.title as string,
        url: item.url as string,
        source: item.source as string,
        publishedAt: item.time_published as string,
        overallSentimentScore: parseFloat(
          item.overall_sentiment_score as string
        ),
        overallSentimentLabel: item.overall_sentiment_label as string,
        tickerSentimentScore: tickerSentiment
          ? parseFloat(tickerSentiment.ticker_sentiment_score)
          : 0,
        tickerSentimentLabel: tickerSentiment
          ? tickerSentiment.ticker_sentiment_label
          : "Neutral",
      };
    }
  );

  const scores = articles.map((a) => a.tickerSentimentScore);
  const avg =
    scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : 0;

  let overallLabel = "Neutral";
  if (avg >= 0.15) overallLabel = "Bullish";
  else if (avg >= 0.05) overallLabel = "Somewhat Bullish";
  else if (avg <= -0.15) overallLabel = "Bearish";
  else if (avg <= -0.05) overallLabel = "Somewhat Bearish";

  return {
    articles,
    averageScore: parseFloat(avg.toFixed(4)),
    overallLabel,
  };
}
