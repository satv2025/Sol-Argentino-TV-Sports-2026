const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

/* =====================================================
   LOGOS OFICIALES (IDs REALES CDN PROMIEDOS)
   🔥 ESTO ES LA SOLUCIÓN REAL
===================================================== */

const logos = {
    "Platense": "hcah",
    "Vélez": "ihc",
    "Lanús": "igj",
    "San Lorenzo": "igf",
    "Estudiantes": "igh",
    "Defensa": "hcbh",
    "Independiente": "ihe",
    "Boca Jrs.": "igg",
    "Gimnasia (M)": "bbjbf",
    "Talleres": "jche",
    "Newell's": "ihh",
    "Unión": "hcag",
    "Central Córdoba": "beafh",
    "Instituto": "hchc",
    "Riestra": "bbjea",

    "River": "igi",
    "Ind. Rivadavia": "hcch",
    "Tigre": "iid",
    "Belgrano": "fhid",
    "Argentinos": "ihb",
    "Central": "ihf",
    "Sarmiento": "hbbh",
    "Gimnasia": "iia",
    "Aldosivi": "hccd",
    "Huracán": "iie",
    "Atl. Tucumán": "gbfc",
    "Banfield": "ihi",
    "Barracas": "jafb",
    "Estudiantes RC": "bheaf",
    "Racing": "ihg"
};

const logoURL = name =>
    `https://api.promiedos.com.ar/images/team/${logos[name]}/1`;


/* =====================================================
   TABLA
===================================================== */

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
            <img src="${logoURL(t.team)}" class="teamLogo">
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


/* =====================================================
   FIXTURE (logos vienen del scraping)
===================================================== */

let fixtureData = {};
let fechas = [];

function renderFixture() {

    const fecha = fechas[0];
    const partidos = fixtureData[fecha] || [];

    document.getElementById("fixtureBox").innerHTML =
        partidos.map(([home, away, score, status, live, homeLogo, awayLogo]) => `
      <div class="matchCard ${live ? 'liveMatch' : ''}">

        <span class="teamSide">
          <img src="https://api.promiedos.com.ar/images/team/${homeLogo}/1" class="teamLogo">
          ${home}
        </span>

        <span>${score}</span>

        <span class="teamSide">
          ${away}
          <img src="https://api.promiedos.com.ar/images/team/${awayLogo}/1" class="teamLogo">
        </span>

      </div>
    `).join("");
}


/* =====================================================
   LOAD
===================================================== */

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