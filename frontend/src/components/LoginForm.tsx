"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        className="rounded px-2 py-1 border"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />
      <input
        type="password"
        className="rounded px-2 py-1 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button className="rounded bg-[var(--primary-blue)] px-3 py-1 text-white" disabled={loading}>
        {loading ? "..." : "Sign in"}
      </button>
      {error ? <div className="text-sm text-red-600 ml-2">{error}</div> : null}
    </form>
  );
}
