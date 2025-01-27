import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        <li>
          <Link href="/study">Home</Link>
        </li>
        <li>
          <Link href="/study/contact-us">Contact Us</Link>
        </li>
        <li>
          <Link href="/study/products">Products</Link>
        </li>
      </ul>
    </div>
  );
}
