'use client';

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login Data:", data);
      console.log("Login Error:", error);

      if (error) {
        console.error("Supabase Error:", error);
        setError(`${error.message} (${error.status ?? "sin código"})`);
        setLoading(false);
        return;
      }

      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Unexpected Error:", err);
      setError(err?.message || "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form className="loginForm" onSubmit={submit}>
      <label>
        Correo electrónico
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && (
        <p className="formError" style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      <button className="btn" disabled={loading}>
        {loading ? "Entrando..." : "Entrar al Panel Pastoral"}
      </button>
    </form>
  );
}