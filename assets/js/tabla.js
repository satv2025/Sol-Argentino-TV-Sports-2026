/* =====================================================
   SATV TABLA + FIXTURE PRO (DINÁMICO DESDE SUPABASE)
===================================================== */

/* =========================
   SUPABASE CLIENT
========================= */

const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

/* =========================
   ESCUDOS (igual que antes)
========================= */

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
    `https://api.promiedos.com.ar/images/team/${logos[name] || "igg"}/1`;


/* =====================================================
   TABLA RENDER
===================================================== */

function renderZona(id, titulo, data) {

    const el = document.getElementById(id);

    el.innerHTML = `
  <div class="zoneTitle">${titulo}</div>

  <div class="zoneHeader">
  <span>#</span><span>Equipo</span><span>PTS</span><span>J</span>
  <span>GF</span><span>GC</span><span>DG</span><span>G</span><span>E</span><span>P</span>
  </div>

  ${data.map((t, i) => {

        const [gf, gc] = t.gol.split(":").map(Number);
        const dg = gf - gc;

        return `
    <div class="zoneRow ${i < 8 ? 'top' : ''}">

      <span>${i + 1}</span>

      <span class="teamCell">
        <img src="${logoURL(t.team)}" class="teamLogo">
        ${t.team}
      </span>

      <span>${t.pts}</span>
      <span>${t.pj}</span>
      <span>${gf}</span>
      <span>${gc}</span>
      <span>${dg > 0 ? "+" + dg : dg}</span>
      <span>${t.g}</span>
      <span>${t.e}</span>
      <span>${t.p}</span>

    </div>`;
    }).join("")}
  `;
}


/* =====================================================
   FIXTURE
===================================================== */

let fixtureData = {};
let fechas = [];
let current = 0;

function renderFixture() {

    const fecha = fechas[current];

    document.getElementById("fechaTrigger").firstChild.nodeValue =
        fecha + " ";

    document.getElementById("fixtureBox").innerHTML =
        fixtureData[fecha].map(([home, away, score, status]) => `
      <div class="matchCard">

        <div class="matchTeams">

          <span class="teamSide">
            <img src="${logoURL(home)}" class="teamLogo">
            ${home}
          </span>

          <span class="matchScore">${score}</span>

          <span class="teamSide right">
            ${away}
            <img src="${logoURL(away)}" class="teamLogo">
          </span>

        </div>

        <div class="matchStatus">${status}</div>

      </div>
    `).join("");
}


function initDropdown() {

    const dropdown = document.getElementById("fechaDropdown");
    const trigger = document.getElementById("fechaTrigger");
    const menu = document.getElementById("fechaMenu");

    fechas.forEach((f, i) => {
        const item = document.createElement("div");
        item.className = "dropdownItem";
        item.textContent = f;

        item.onclick = () => {
            current = i;
            dropdown.classList.remove("open");
            renderFixture();
        };

        menu.appendChild(item);
    });

    trigger.onclick = () => dropdown.classList.toggle("open");

    document.getElementById("prevFecha").onclick = () => {
        if (current > 0) { current--; renderFixture(); }
    };

    document.getElementById("nextFecha").onclick = () => {
        if (current < fechas.length - 1) { current++; renderFixture(); }
    };

    renderFixture();
}


/* =====================================================
   🔥 CARGAR DATOS DESDE EDGE FUNCTION
===================================================== */

async function loadData() {

    const { data, error } =
        await sb.functions.invoke("api-promiedos");

    if (error) {
        console.error(error);
        return;
    }

    renderZona("zonaA", "Zona A", data.zonaA);
    renderZona("zonaB", "Zona B", data.zonaB);

    fixtureData = data.fixture;
    fechas = Object.keys(fixtureData);

    initDropdown();
}


/* =====================================================
   INIT
===================================================== */

document.addEventListener("DOMContentLoaded", loadData);