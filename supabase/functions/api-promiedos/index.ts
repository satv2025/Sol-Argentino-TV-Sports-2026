import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async () => {
  const res = await fetch(
    "https://api.promiedos.com.ar/league/tables_and_fixtures/hc",
    {
      headers: {
        "x-ver": "1.11.7.5",
        "referer": "https://www.promiedos.com.ar/",
        "user-agent": "Mozilla/5.0"
      }
    }
  );

  const data = await res.json();

  /* ========= TABLAS ========= */

  const parseZona = (rows: any[]) =>
    rows.map((r: any) => {
      const v = Object.fromEntries(r.values.map((x: any) => [x.key, x.value]));

      return {
        team: r.entity.object.short_name,
        logo: r.entity.object.id,   // 🔥 id real
        pts: +v.Points,
        pj: +v.GamePlayed,
        g: +v.GamesWon,
        e: +v.GamesEven,
        p: +v.GamesLost,
        gol: v.Goals
      };
    });

  const zonaA = parseZona(data.tables_groups[0].tables[0].table.rows);
  const zonaB = parseZona(data.tables_groups[0].tables[1].table.rows);

  /* ========= FIXTURE ========= */

  const games =
    data.games.filters.find((f: any) => f.selected)?.games ?? [];

  const fixture = games.map((g: any) => ({
    home: g.teams[0].short_name,
    homeLogo: g.teams[0].id,
    away: g.teams[1].short_name,
    awayLogo: g.teams[1].id,
    score: g.scores ? `${g.scores[0]}-${g.scores[1]}` : "-",
    status: g.status.short_name,
    live: g.status.enum === 2
  }));

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