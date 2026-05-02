"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import type { AuthUser, UserRole } from "../../../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type AcceptInviteResponse = {
  message?: string;
  token: string;
  user: AuthUser & { role: string };
};

export default function AcceptInviteContent() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid invitation link. Missing token or email.");
    }
  }, [token, email]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Missing invitation details");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/admin/accept-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, name, password }),
      });

      const data: AcceptInviteResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept invite");
      }

      // 🔥 Fix role + name typing
      const role = data.user.role as UserRole;

      login(data.token, {
        ...data.user,
        name: data.user.name || "User",
        role,
      });

      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div>
          <h1>Invalid Invitation</h1>
          <Link href="/login">Go to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleAccept}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Accept Invite"}
        </button>
      </form>
    </main>
  );
}