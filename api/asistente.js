export const config = { runtime: 'edge' };

/*  Demo del asistente de llamadas y WhatsApp.
    Recibe { messages, empresa, sector, nombre, servicio } y responde
    como la recepcionista con IA de esa empresa.                      */

const SECTOR_TXT = {
  construccion: 'construcción y reformas (obras, reformas integrales, cocinas, baños)',
  arquitectura: 'estudio de arquitectura (proyectos, reformas, licencias)',
  estetica: 'centro de estética y bienestar (tratamientos faciales, corporales, citas)',
  piscinas: 'construcción y mantenimiento de piscinas',
  interiorismo: 'estudio de interiorismo',
  ingenieria: 'ingeniería (proyectos técnicos, certificados, instalaciones)',
  mueble: 'tienda de muebles y cocinas a medida',
  consultoria: 'consultoría de procesos comerciales y automatización con IA para pymes',
  otro: 'empresa de servicios',
};

function buildPrompt({ empresa, sector, nombre, servicio }) {
  const e = (empresa || 'la empresa').slice(0, 80);
  const n = (nombre || 'Marta').slice(0, 40);
  const s = SECTOR_TXT[sector] || SECTOR_TXT.otro;
  const srv = (servicio || 'una cita con el equipo').slice(0, 120);

  return `Eres ${n}, la recepcionista con inteligencia artificial de ${e}, una ${s}. Esto es una DEMO en la web: la persona está probando cómo atenderías sus llamadas y mensajes.

TU TRABAJO
1. Saludar con el nombre de la empresa y preguntar en qué puedes ayudar.
2. Entender qué necesita la persona con 1 o 2 preguntas concretas (tipo de servicio, zona, plazo).
3. Resolver dudas frecuentes con sentido común para este sector. Si no sabes un dato concreto (precio exacto, disponibilidad real), dilo y ofrece que el equipo lo confirme.
4. Proponer dos huecos para ${srv} (por ejemplo "mañana a las 10:00 o el jueves a las 17:00") y pedir nombre y teléfono para confirmar.
5. Cuando tengas nombre, teléfono y hueco elegido, confirma la cita y termina tu mensaje con una línea exacta con este formato:
[RESUMEN] Nombre: … | Teléfono: … | Necesidad: … | Cita: …

ESTILO
- Español de España, natural, cercano y breve: máximo 60 palabras por respuesta. Una pregunta por mensaje.
- Sin listas, sin markdown, sin emojis. Hablas como por teléfono.
- Nunca inventes precios ni datos de la empresa. Nunca digas que eres ChatGPT ni OpenAI: eres ${n}, la asistente de ${e}.
- Si la persona pide hablar con una persona del equipo, toma nombre y teléfono y di que le devolverán la llamada en breve.`;
}

export default async function handler(req) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: cors });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: cors });
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
    const clean = messages
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 1200) }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 220,
        temperature: 0.6,
        messages: [{ role: 'system', content: buildPrompt(body) }, ...clean],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Error OpenAI' }), { status: response.status, headers: cors });
    }
    const reply = data.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ reply }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
  }
}
