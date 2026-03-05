import { useEffect, useState } from "react";
import { healthCheck } from "../api/test";


interface HealthData {
    message: string;
    version: string;
}

export default function Layout() {
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await healthCheck();
                setHealthData(res);
                console.log("API Response:", res);
            } catch (err) {
                console.error("API Error:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            }
        };
        fetchHealth();
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">AI Resume Screening System</h1>
            {error && <p className="text-red-500">Error: {error}</p>}
            {healthData ? (
                <div>
                    <p className="mb-2"><strong>Message:</strong> {healthData.message}</p>
                    <p><strong>Version:</strong> {healthData.version}</p>
                </div>
            ) : !error && (
                <p>Loading...</p>
            )}
        </div>
    );
}
