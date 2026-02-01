import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async () => {
  const res = await fetch("https://www.promiedos.com.ar/", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const html = await res.text();

  /* =========================
     helpers
  ========================= */

  const clean = (s: string) =>
    s.replace(/<[^>]+>/g, "").trim();

  /* =========================
     TABLA (regex genérico)
  ========================= */

  const rowRegex =
    /<tr.*?>([\s\S]*?)<\/tr>/g;

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
     FIXTURE simple
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
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
});