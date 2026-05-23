import styles from "./StockOverview.module.css";

interface StockOverviewProps {
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
  quote: {
    currentPrice: number;
    change: number;
    percentChange: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    previousClose: number;
  };
}

function formatMarketCap(mcap: number): string {
  if (!mcap) return "N/A";
  if (mcap >= 1000000) return `$${(mcap / 1000000).toFixed(2)}T`;
  if (mcap >= 1000) return `$${(mcap / 1000).toFixed(2)}B`;
  return `$${mcap.toFixed(2)}M`;
}

function formatPrice(price: number, currency: string): string {
  if (!price) return "N/A";
  const symbol = currency === "USD" ? "$" : currency;
  return `${symbol}${price.toFixed(2)}`;
}

export default function StockOverview({ profile, quote }: StockOverviewProps) {
  const isPositive = quote.change >= 0;

  return (
    <div className={styles.card} id="stock-overview">
      <div className={styles.header}>
        <div className={styles.companyInfo}>
          {profile.logo && (
            <img
              src={profile.logo}
              alt={profile.name}
              className={styles.logo}
            />
          )}
          {!profile.logo && (
            <div className={styles.logoFallback}>
              {profile.ticker?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <div className={styles.companyName}>{profile.name}</div>
            <div className={styles.ticker}>
              {profile.ticker} · {profile.exchange}{" "}
              {profile.industry ? `· ${profile.industry}` : ""}
            </div>
          </div>
        </div>

        <div className={styles.priceBlock}>
          <div className={styles.price}>
            {formatPrice(quote.currentPrice, profile.currency)}
          </div>
          <div
            className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}
          >
            {isPositive ? "+" : ""}
            {quote.change?.toFixed(2)} ({isPositive ? "+" : ""}
            {quote.percentChange?.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Open</div>
          <div className={styles.metricValue}>
            {formatPrice(quote.openPrice, profile.currency)}
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Previous Close</div>
          <div className={styles.metricValue}>
            {formatPrice(quote.previousClose, profile.currency)}
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Day High</div>
          <div className={styles.metricValue}>
            {formatPrice(quote.highPrice, profile.currency)}
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Day Low</div>
          <div className={styles.metricValue}>
            {formatPrice(quote.lowPrice, profile.currency)}
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Market Cap</div>
          <div className={styles.metricValue}>
            {formatMarketCap(profile.marketCap)}
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Country</div>
          <div className={styles.metricValue}>{profile.country || "N/A"}</div>
        </div>
      </div>
    </div>
  );
}
