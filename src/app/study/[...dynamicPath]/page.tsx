import Link from "next/link";

interface PageProps {
  params: {
    dynamicPath: string[];
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      Dynamic path:
      {params.dynamicPath.map((path, index) => {
        return <li key={index}>{path}</li>;
      })}
      <Link href={`/study`}>Back to Home page</Link>
    </div>
  );
}
