import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div>
      <h1>Contact Us Page</h1>
      <Link href={`/study`} className={styles.link}>
        Back to Home page
      </Link>
    </div>
  );
}
