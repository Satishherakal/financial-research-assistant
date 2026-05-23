"use client";

import styles from "./HistoryPanel.module.css";

interface HistoryEntry {
  id: string;
  ticker: string;
  company_name: string;
  created_at: string;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (ticker: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
  return (
    <div className={styles.panel} id="history-panel">
      <h3 className={styles.title}>Recent Analyses</h3>

      {history.length === 0 ? (
        <p className={styles.empty}>No analyses yet. Search a ticker to get started.</p>
      ) : (
        <div className={styles.list}>
          {history.map((entry) => (
            <button
              key={entry.id}
              className={styles.item}
              onClick={() => onSelect(entry.ticker)}
            >
              <div className={styles.itemTicker}>{entry.ticker}</div>
              <div className={styles.itemName}>{entry.company_name}</div>
              <div className={styles.itemDate}>
                {formatDate(entry.created_at)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
