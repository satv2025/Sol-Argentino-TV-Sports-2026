import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};

serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  const res = await fetch(
    "https://www.promiedos.com.ar/league/liga-profesional/hc",
    { headers: { "User-Agent": "Mozilla/5.0" } }
  );

  const html = await res.text();

  /* =====================================================
     TABLA (__NEXT_DATA__)
  ===================================================== */

  let zonaA: any[] = [];
  let zonaB: any[] = [];

  const next = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/);

  if (next) {
    const json = JSON.parse(next[1]);
    const tables = json.props.pageProps.data.tables_groups[0].tables;

    const mapZona = (rows: any[]) =>
      rows.map((r: any) => {
        const v = Object.fromEntries(
          r.values.map((x: any) => [x.key, x.value])
        );

        return {
          team: r.entity.object.short_name,
          pts: +v.Points,
          pj: +v.GamePlayed,
          g: +v.GamesWon,
          e: +v.GamesEven,
          p: +v.GamesLost,
          gol: v.Goals,
          logo: r.entity.object.logo
            ?.split("/team/")[1]
            ?.split("/")[0]
        };
      });

    zonaA = mapZona(tables[0].table.rows);
    zonaB = mapZona(tables[1].table.rows);
  }

  /* =====================================================
     FIXTURE (HTML REAL)
  ===================================================== */

  const fixture: any = { "Fecha actual": [] };

  const blocks =
    html.match(/<a[^>]*class="item_item__BqOgz[\s\S]*?<\/a>/g) || [];

  for (const block of blocks) {

    /* equipos + logos */
    const teams = [...block.matchAll(
      /images\/team\/([^\/]+)\/1"[^>]*alt="([^"]+)"/g
    )];

    if (teams.length < 2) continue;

    const homeLogo = teams[0][1];
    const home = teams[0][2];

    const awayLogo = teams[1][1];
    const away = teams[1][2];

    /* score u hora */
    const score =
      block.match(/scores_scoreseventresult__[^>]*>(\d+)/g)
        ?.map(s => s.match(/\d+/)[0])
        ?.join("-")
      ||
      block.match(/time_time__[^>]*>([^<]+)/)?.[1]
      ||
      "-";

    /* estado */
    const status =
      block.match(/time_status___[^>]*>([^<]+)/)?.[1]
      || "Próximo";

    /* live */
    const live = /time_live__/.test(block);

    fixture["Fecha actual"].push([
      home,
      away,
      score,
      status,
      live,
      homeLogo,
      awayLogo
    ]);
  }

  return new Response(
    JSON.stringify({ zonaA, zonaB, fixture }),
    {
      headers: {
        "Content-Type": "application/json",
        ...cors
      }
    }
  );
});