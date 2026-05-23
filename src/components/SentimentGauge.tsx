import styles from "./SentimentGauge.module.css";

interface SentimentArticle {
  title: string;
  tickerSentimentLabel: string;
  tickerSentimentScore: number;
}

interface SentimentGaugeProps {
  averageScore: number;
  overallLabel: string;
  articles: SentimentArticle[];
}

function getLabelClass(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("bullish")) return styles.bullish;
  if (lower.includes("bearish")) return styles.bearish;
  return styles.neutral;
}

function getBadgeClass(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("bullish")) return styles.badgeBullish;
  if (lower.includes("bearish")) return styles.badgeBearish;
  return styles.badgeNeutral;
}

function getGaugeColor(score: number): string {
  if (score >= 0.1) return "var(--green)";
  if (score <= -0.1) return "var(--red)";
  return "var(--yellow)";
}

export default function SentimentGauge({
  averageScore,
  overallLabel,
  articles,
}: SentimentGaugeProps) {
  // Normalize score from [-1, 1] to [0, 100] for the gauge bar
  const gaugePercent = Math.max(0, Math.min(100, (averageScore + 1) * 50));

  if (!articles || articles.length === 0) {
    return (
      <div className={styles.card} id="sentiment-gauge">
        <h3 className={styles.title}>News Sentiment</h3>
        <p className={styles.empty}>
          Sentiment data not available. This may be due to API rate limits.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card} id="sentiment-gauge">
      <h3 className={styles.title}>News Sentiment</h3>

      <div className={styles.gaugeContainer}>
        <div className={styles.gaugeTrack}>
          <div
            className={styles.gaugeBar}
            style={{
              width: `${gaugePercent}%`,
              background: getGaugeColor(averageScore),
            }}
          />
        </div>
        <div className={styles.gaugeLabels}>
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>

      <div className={styles.scoreRow}>
        <span className={`${styles.label} ${getLabelClass(overallLabel)}`}>
          {overallLabel}
        </span>
        <span className={styles.score}>Score: {averageScore.toFixed(4)}</span>
      </div>

      {articles.length > 0 && (
        <div className={styles.articleList}>
          {articles.slice(0, 5).map((article, i) => (
            <div key={i} className={styles.sentimentArticle}>
              <span className={styles.sentimentArticleTitle}>
                {article.title}
              </span>
              <span
                className={`${styles.badge} ${getBadgeClass(article.tickerSentimentLabel)}`}
              >
                {article.tickerSentimentLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
