"use client";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./PasswordProtection.module.css";

const CORRECT_PASSWORD = "abc123";
const AUTH_KEY = "video-organizer-auth";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>🔒 Protected Area</h1>
          <p className={styles.subtitle}>Enter password to access Video Organizer</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
            autoFocus
            required
          />
          
          {error && <p className={styles.error}>{error}</p>}
          
          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              Unlock
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className={styles.cancelBtn}
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function clearVideoOrganizerAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}
