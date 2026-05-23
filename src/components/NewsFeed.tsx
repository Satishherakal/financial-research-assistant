import styles from "./NewsFeed.module.css";

interface Article {
  headline: string;
  source: string;
  url: string;
  datetime: number;
  image: string;
  summary: string;
}

interface NewsFeedProps {
  articles: Article[];
}

function timeAgo(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className={styles.card} id="news-feed">
        <h3 className={styles.title}>Recent News</h3>
        <p className={styles.empty}>No recent news articles found.</p>
      </div>
    );
  }

  return (
    <div className={styles.card} id="news-feed">
      <h3 className={styles.title}>Recent News</h3>
      <div className={styles.list}>
        {articles.map((article, i) => (
          <div className={styles.article} key={i}>
            {article.image && (
              <img
                src={article.image}
                alt=""
                className={styles.articleImage}
              />
            )}
            <div className={styles.articleContent}>
              <div className={styles.headline}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.headline}
                </a>
              </div>
              <div className={styles.meta}>
                <span className={styles.source}>{article.source}</span>
                {" · "}
                {timeAgo(article.datetime)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
