/* =====================================================
   SUPABASE
===================================================== */

const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);


/* =====================================================
   LOGOS TABLA (mapping fijo — única forma real)
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

const logoURL = id =>
    `https://api.promiedos.com.ar/images/team/${id}/1`;

const logoFromName = name =>
    logoURL(logos[name] || "igg");


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
            <img src="${logoFromName(t.team)}" class="teamLogo">
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
   FIXTURE
===================================================== */

let fixtureData = {};

function renderFixture() {

    const box = document.getElementById("fixtureBox");

    if (!box) return;

    const firstKey = Object.keys(fixtureData)[0];
    const partidos = fixtureData[firstKey] || [];

    if (!partidos.length) {
        box.innerHTML = "<p style='opacity:.6'>Sin partidos</p>";
        return;
    }

    box.innerHTML =
        partidos.map(([home, away, score, status, live, homeLogo, awayLogo]) => `

      <div class="matchCard ${live ? 'liveMatch' : ''}">

        <span class="teamSide">
          <img src="${logoURL(homeLogo)}" class="teamLogo">
          ${home}
        </span>

        <span class="matchScore">
          ${live ? "● " : ""}${score}
        </span>

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


/* =====================================================
   LOAD DATA
===================================================== */

async function loadData() {

    try {

        const { data, error } =
            await sb.functions.invoke("api-promiedos");

        if (error) throw error;

        renderZona("zonaA", "Zona A", data.zonaA);
        renderZona("zonaB", "Zona B", data.zonaB);

        fixtureData = data.fixture || {};

        renderFixture();

    } catch (e) {
        console.error("Error cargando datos:", e);
    }
}


/* =====================================================
   INIT
===================================================== */

document.addEventListener("DOMContentLoaded", loadData);