import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <>
      <h1>Product Page {params.id}</h1>
      <Link href={`/study/products`}>Back to Product List</Link>
    </>
  );
}
