import styles from "./LoadingState.module.css";

export default function LoadingState() {
  return (
    <div id="loading-skeleton">
      <div className={styles.skeleton}>
        <div className={`${styles.block} ${styles.blockTall}`} />
        <div className={`${styles.block} ${styles.blockWide}`} />
        <div className={`${styles.block} ${styles.blockMedium}`} />
        <div className={styles.row}>
          <div className={styles.rowBlock} />
          <div className={styles.rowBlock} />
          <div className={styles.rowBlock} />
        </div>
      </div>
    </div>
  );
}
