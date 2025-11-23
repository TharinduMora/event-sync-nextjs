"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const listStr = localStorage.getItem("videoList");
            if (!listStr) {
                alert("No data found in localStorage. Go back to the list page first.");
                router.push("/list");
                return;
            }

            const list = JSON.parse(listStr);
            const found = list.find((d: any) => d.id === Number(params.id));
            if (!found) {
                alert("Item not found.");
                router.push("/list");
                return;
            }

            setItem(found);
        }
    }, [params.id, router]);

    if (!item) return <p>Loading...</p>;

    return (
        <main style={{ paddingTop: '100px' }}>

            <iframe
                src={item.link}
                width="640"
                height="360"
                allowFullScreen
                title="Video"
            ></iframe>
            <h1>Video Detail</h1>
            <p>Date: {item.date}</p>
            <p>Tags: {item.tags}</p>
            <p>Time Duration: {item.timeDuration}</p>
        </main>
    );
}
