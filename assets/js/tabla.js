const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

const logoURL = id =>
    `https://api.promiedos.com.ar/images/team/${id}/1`;


/* ================= TABLA ================= */

function renderZona(id, titulo, data) {

    const el = document.getElementById(id);

    el.innerHTML = `
    <h2>${titulo}</h2>

    ${data.map((t, i) => {
        const [gf, gc] = t.gol.split(":").map(Number);

        return `
        <div class="zoneRow">
          <span>${i + 1}</span>
          <span class="teamCell">
            <img src="${logoURL(t.logo)}" class="teamLogo">
            ${t.team}
          </span>
          <span>${t.pts}</span>
          <span>${t.pj}</span>
          <span>${gf}</span>
          <span>${gc}</span>
          <span>${t.g}</span>
          <span>${t.e}</span>
          <span>${t.p}</span>
        </div>
      `;
    }).join("")}
  `;
}


/* ================= FIXTURE ================= */

let fixtureData = {};
let fechas = [];
let current = 0;

function renderFixture() {

    const fecha = fechas[current];
    const partidos = fixtureData[fecha] || [];

    document.getElementById("fixtureBox").innerHTML =
        partidos.map(([home, away, score, status, live, homeLogo, awayLogo]) => `
      <div class="matchCard ${live ? 'liveMatch' : ''}">

        <span class="teamSide">
          <img src="${logoURL(homeLogo)}" class="teamLogo">
          ${home}
        </span>

        <span class="matchScore">${live ? "● " : ""}${score}</span>

        <span class="teamSide">
          ${away}
          <img src="${logoURL(awayLogo)}" class="teamLogo">
        </span>

        <div class="matchStatus ${live ? 'liveStatus' : ''}">
          ${live ? "EN VIVO" : status}
        </div>

      </div>
    `).join("");
}


/* ================= LOAD ================= */

async function loadData() {

    const { data } =
        await sb.functions.invoke("api-promiedos");

    renderZona("zonaA", "Zona A", data.zonaA);
    renderZona("zonaB", "Zona B", data.zonaB);

    fixtureData = data.fixture;
    fechas = Object.keys(fixtureData);

    renderFixture();
}

document.addEventListener("DOMContentLoaded", loadData);