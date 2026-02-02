// Importación de cheerio (usamos CDN)
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// Definimos la función para hacer scraping y devolver los partidos
Deno.serve(async (req) => {
  const url = 'https://www.promiedos.com.ar/';

  try {
    // Realizamos la solicitud con fetch
    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const partidos: any[] = [];

    // Selección de partidos desde el HTML
    $('tr[name="nvp"]').each((_, el) => {
      const row = $(el);

      // Extraemos la liga y la información del partido
      const leagueTitleElement = row.prevAll('.tituloin').first().find('a');
      const leagueTitle = leagueTitleElement.text().trim();
      const leagueFlag = leagueTitleElement.find('img').attr('src');

      // Extraemos el estado del partido
      const gameStatePlay = row.find('.game-play').text().trim();
      const gameStateFin = row.find('.game-fin').text().trim();
      const gameStateTime = row.find('.game-time').text().trim();
      let gameState = gameStatePlay || gameStateFin || gameStateTime;

      // Equipos y goles
      const gamet1 = row.find('.game-t1').first().find('.datoequipo').text().trim();
      const gamet2 = row.find('.game-t1').last().find('.datoequipo').text().trim();
      const gamer1 = row.find('.game-r1 span').text().trim();
      const gamer2 = row.find('.game-r2 span').text().trim();

      // Solo agregamos el partido si tiene información relevante
      if (leagueTitle && gamet1 && gamet2 && gamer1 && gamer2) {
        partidos.push({
          leagueTitle,
          leagueFlag,
          gameState,
          gamet1,
          gamet2,
          gamer1,
          gamer2,
          url: "https://www.promiedos.com.ar/"
        });
      }
    });

    // Respuesta
    return new Response(
      JSON.stringify({ zonaA: [], zonaB: [], fixture: partidos }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (e) {
    console.error('Error al obtener los datos:', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});