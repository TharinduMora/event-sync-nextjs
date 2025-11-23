"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListPage() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/sheet-data");
            const json = await res.json();
            setData(json.data || []);

            // Save to localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("videoList", JSON.stringify(json.data || []));
            }
        };
        load();
    }, []);

    return (
        <main>
            <h1>Video List</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        <Link href={`/view/${item.id}`}>
                            {item.date} - {item.tags} ({item.timeDuration})
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
