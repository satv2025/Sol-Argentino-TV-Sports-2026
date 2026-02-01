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

/* ================= FIXTURE ================= */

let fixtureData = {};

function renderFixture() {

    const partidos =
        Object.values(fixtureData)[0] || []; // 🔥 siempre agarra la primera fecha

    const box = document.getElementById("fixtureBox");

    if (!partidos.length) {
        box.innerHTML = "<p style='opacity:.6'>Sin partidos</p>";
        return;
    }

    box.innerHTML =
        partidos.map(([home, away, score, status, live, homeLogo, awayLogo]) => `
      <div class="matchCard ${live ? 'liveMatch' : ''}">

        <span class="teamSide">
          <img src="https://api.promiedos.com.ar/images/team/${homeLogo}/1" class="teamLogo">
          ${home}
        </span>

        <span class="matchScore">
          ${live ? "● " : ""}${score}
        </span>

        <span class="teamSide">
          ${away}
          <img src="https://api.promiedos.com.ar/images/team/${awayLogo}/1" class="teamLogo">
        </span>

        <div class="matchStatus ${live ? 'liveStatus' : ''}">
          ${live ? "EN VIVO" : status}
        </div>

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

    renderFixture(); // 🔥 directo, sin fechas, sin dropdown
}