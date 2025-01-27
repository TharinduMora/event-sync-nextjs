import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div>
      <h1>Contact Us Page</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum fugiat
        sint eaque dolores saepe esse numquam facilis, ullam voluptate. Earum
        pariatur saepe omnis perspiciatis unde expedita quae sint officiis.
        Eveniet.
      </p>
      <Link href={`/study`} className={styles.link}>
        Back to Home page
      </Link>
    </div>
  );
}
