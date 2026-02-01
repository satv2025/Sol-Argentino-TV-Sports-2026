import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

serve(async (req) => {

  /* =========================
     CORS preflight (CLAVE 🔥)
  ========================= */
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  /* =========================
     SCRAPE PROMIEDOS
  ========================= */

  const res = await fetch("https://www.promiedos.com.ar/", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const html = await res.text();

  const clean = (s: string) =>
    s.replace(/<[^>]+>/g, "").trim();

  /* =========================
     TABLA
  ========================= */

  const rowRegex = /<tr.*?>([\s\S]*?)<\/tr>/g;

  const zonaA: any[] = [];
  const zonaB: any[] = [];

  let currentZona = zonaA;

  for (const row of html.matchAll(rowRegex)) {
    const cols = [...row[1].matchAll(/<td.*?>([\s\S]*?)<\/td>/g)]
      .map(c => clean(c[1]));

    if (cols.length >= 9) {
      currentZona.push({
        team: cols[1],
        pts: +cols[2],
        pj: +cols[3],
        g: +cols[4],
        e: +cols[5],
        p: +cols[6],
        gol: `${cols[7]}:${cols[8]}`
      });

      if (currentZona.length === 15) currentZona = zonaB;
    }
  }

  /* =========================
     FIXTURE
  ========================= */

  const matchRegex =
    /class="game-title".*?>(.*?)<.*?class="game-score".*?>(.*?)<.*?class="game-status".*?>(.*?)</g;

  const fixture = {
    "Hoy": [...html.matchAll(matchRegex)].map(m => [
      clean(m[1].split("-")[0]),
      clean(m[1].split("-")[1]),
      clean(m[2]),
      clean(m[3])
    ])
  };

  /* ========================= */

  return new Response(
    JSON.stringify({ zonaA, zonaB, fixture }),
    {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
});