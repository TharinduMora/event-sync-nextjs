import Link from "next/link";
import Style from "./page.module.css";

export default function Page() {
  const productList = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];
  return (
    <>
      <h1>Product List Page</h1>
      <ul>
        {productList.map((product) => {
          return (
            <li key={product.id}>
              <Link
                href={`/study/products/${product.id}`}
                className={Style.link}
              >
                {product.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href={`/study`}>Back to Home page</Link>
    </>
  );
}
