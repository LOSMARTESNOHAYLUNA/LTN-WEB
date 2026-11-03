export const config = { runtime: 'edge' };

/*  Recibe las solicitudes "Quiero que me llamen" / "Quiero que me escriban"
    de la landing del asistente y las reenvía al webhook configurado en
    Vercel (variable LEAD_WEBHOOK_URL, p. ej. un inbound webhook de
    GoHighLevel). Si no hay webhook, responde ok:false para que la web
    muestre la alternativa por WhatsApp.                                */

export default async function handler(req) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), { status: 405, headers: cors });
  }

  try {
    const b = await req.json();
    const lead = {
      tipo: String(b.tipo || '').slice(0, 20),          // "llamada" | "whatsapp"
      nombre: String(b.nombre || '').slice(0, 80),
      telefono: String(b.telefono || '').slice(0, 30),
      horario: String(b.horario || '').slice(0, 80),
      empresa: String(b.empresa || '').slice(0, 80),    // empresa para la que se personalizó la landing
      sector: String(b.sector || '').slice(0, 30),
      origen: 'landing asistente-ia',
      pagina: String(b.pagina || '').slice(0, 300),
      fecha: new Date().toISOString(),
    };
    if (!lead.nombre || !lead.telefono) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan nombre o teléfono' }), { status: 400, headers: cors });
    }

    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (!webhook) {
      return new Response(JSON.stringify({ ok: false, reason: 'no-webhook' }), { headers: cors });
    }

    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return new Response(JSON.stringify({ ok: r.ok }), { headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers: cors });
  }
}
