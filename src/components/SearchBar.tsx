"use client";

import { useState, FormEvent } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (ticker: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <input
        id="search-input"
        type="text"
        className={styles.input}
        placeholder="Enter stock ticker (e.g. AAPL, TSLA, MSFT)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      <button
        id="search-button"
        type="submit"
        className={styles.button}
        disabled={loading || !query.trim()}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
