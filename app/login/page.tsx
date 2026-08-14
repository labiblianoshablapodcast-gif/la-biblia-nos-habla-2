import {Suspense} from "react";
import LoginForm from "@/components/LoginForm";

export default function Login(){
  return <section className="section loginPage">
    <div className="loginCard">
      <p className="eyebrow">Acceso privado</p>
      <h1>Panel Pastoral</h1>
      <p>Solo el pastor y el equipo autorizado pueden entrar.</p>
      <Suspense><LoginForm/></Suspense>
    </div>
  </section>;
}
