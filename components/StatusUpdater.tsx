'use client';

import {useState} from "react";
import {createClient} from "@/lib/supabase/client";

const OPTIONS = [
  ["Nuevo","Nuevo"],
  ["En seguimiento","En seguimiento"],
  ["Contactado","Contactado"],
  ["Discipulado","Discipulado"],
  ["Completado","Completado"]
];

export default function StatusUpdater({
  table,
  id,
  initialStatus
}:{
  table:"prayer_requests"|"new_believers";
  id:number;
  initialStatus:string;
}){
  const [status,setStatus]=useState(initialStatus || "Nuevo");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  async function updateStatus(nextStatus:string){
    const previousStatus=status;
    setStatus(nextStatus);
    setSaving(true);
    setMessage("");

    const supabase=createClient();
    const {error}=await supabase
      .from(table)
      .update({status:nextStatus})
      .eq("id",id);

    setSaving(false);

    if(error){
      console.error("No se pudo actualizar el estado",error);
      setStatus(previousStatus);
      setMessage("No se guardó. Inténtelo otra vez.");
      return;
    }

    setMessage("Guardado");
    window.setTimeout(()=>setMessage(""),1800);
  }

  return <div className="statusUpdater">
    <select
      value={status}
      disabled={saving}
      onChange={event=>updateStatus(event.target.value)}
      aria-label="Estado de seguimiento"
      aria-busy={saving}
    >
      {OPTIONS.map(([value,label])=><option key={value} value={value}>{label}</option>)}
    </select>
    {saving && <small role="status">Guardando…</small>}
    {!saving && message && <small role="status">{message}</small>}
  </div>;
}
