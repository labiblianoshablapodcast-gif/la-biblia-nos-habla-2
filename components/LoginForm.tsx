'use client';

import {FormEvent,useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import {createClient} from "@/lib/supabase/client";

export default function LoginForm(){
  const router=useRouter();
  const params=useSearchParams();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(event:FormEvent){
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase=createClient();
    const {error}=await supabase.auth.signInWithPassword({email,password});

    if(error){
      setError("No se pudo iniciar sesión. Verifique su correo y contraseña.");
      setLoading(false);
      return;
    }

    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return <form className="loginForm" onSubmit={submit}>
    <label>Correo electrónico
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
    </label>
    <label>Contraseña
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
    </label>
    {error && <p className="formError">{error}</p>}
    <button className="btn" disabled={loading}>
      {loading ? "Entrando..." : "Entrar al Panel Pastoral"}
    </button>
  </form>;
}
