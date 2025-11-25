import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Event Sync Application</h1>
        <p className={styles.subtitle}>Organize and manage your content efficiently</p>
      </div>

      <div className={styles.features}>
        <Link href="/video-organizer" className={styles.featureCard}>
          <div className={styles.icon}>🎥</div>
          <h2>Video Organizer</h2>
          <p>Manage your video library with tags, search, and organize your content seamlessly.</p>
          <span className={styles.cta}>Get Started →</span>
        </Link>

        <div className={styles.featureCard} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          <div className={styles.icon}>📅</div>
          <h2>Event Manager</h2>
          <p>Coming soon - Schedule and track your events with ease.</p>
          <span className={styles.badge}>Coming Soon</span>
        </div>

        <div className={styles.featureCard} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          <div className={styles.icon}>📊</div>
          <h2>Analytics Dashboard</h2>
          <p>Coming soon - Get insights and analytics about your content.</p>
          <span className={styles.badge}>Coming Soon</span>
        </div>
      </div>
    </main>
  );
}
