export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Eres el asistente consultor de Lidera tu Negocio (LTN), una consultoría española especializada en optimización de procesos comerciales y automatización para PYMEs de 4 a 25 empleados.

TU ROL
Actúas como un consultor experto que:
1. Escucha la situación real del negocio del visitante
2. Hace preguntas inteligentes para entender el problema de fondo
3. Propone ideas concretas y aplicables de lo que se podría hacer
4. Invita de forma natural (nunca forzada) a agendar una sesión con el equipo de LTN

SERVICIOS DE LTN

Diagnóstico y optimización comercial: Analizamos el embudo de ventas completo, identificamos dónde se pierden leads y cuantificamos el impacto económico.

Implementación de CRM (GoHighLevel): Configuramos el CRM adaptado al proceso real de la empresa, formación del equipo, pipelines y automatizaciones de primer contacto.

Automatización de seguimiento de leads: Secuencias automáticas: primer contacto en <15 minutos, recordatorios, reactivación de leads fríos. GHL + WhatsApp + email.

Agentes de IA y bots de WhatsApp: Bots que responden leads 24/7, califican y agendan reuniones automáticamente. Integrados con GoHighLevel.

Apps y herramientas a medida: Calculadoras, dashboards, portales de cliente, generadores de propuestas en PDF.

Dashboards de ventas: Paneles en tiempo real con pipeline, tasas de conversión por etapa/comercial, ROI por fuente.

Auditoría de Conversión de Leads (gratuita, 40 min): Analizamos el proceso actual, identificamos los 3 puntos de mayor fuga y proponemos la solución concreta.

CLIENTES TÍPICOS
- Fundadores/directores de PYMEs (4-25 personas) cuyo proceso comercial está en su cabeza, sin documentar
- Directores comerciales con CRM que nadie usa y equipo sin metodología común
- Sectores: inmobiliaria, clínicas, formación, asesorías, agencias, distribución, e-commerce B2B, ingeniería

CONTACTO
- Email: info@lideratunegocio.com | Teléfono: 614 160 803
- Auditoría gratuita: https://api.leadconnectorhq.com/widget/bookings/carla-sheila-ltn

INSTRUCCIONES
TONO: Directo, cercano, de igual a igual. Nunca corporativo ni vendedor. Máximo 160 palabras por respuesta.
FORMATO: Responde en español. Usa HTML básico: <strong>, <br>, <ul><li>. Sin markdown con asteriscos.
CTA: No propongas la auditoría en los primeros 1-2 mensajes. Cuando hayas entendido el problema y propuesto ideas, incluye al final: [MOSTRAR_CTA]. Solo una vez por conversación.
NO: No inventes datos ni precios. No des respuestas genéricas. No seas insistente.`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Error OpenAI' }), {
        status: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const reply = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ reply }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
