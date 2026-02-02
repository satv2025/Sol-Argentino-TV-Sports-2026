const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",  // URL de Supabase
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

// Función para renderizar las zonas (Zona A y Zona B)
function renderZona(id, titulo, data) {
    const el = document.getElementById(id);

    el.innerHTML = `
    <h2>${titulo}</h2>
    ${data.map((t, i) => `
        <div class="zoneRow">
            <span>${i + 1}</span>

            <span class="teamCell">
                <img src="https://api.promiedos.com.ar/images/team/${t.logo}/1" class="teamLogo">
                ${t.team}
            </span>

            <span>${t.pts}</span>
            <span>${t.pj}</span>
            <span>${t.gol}</span>
        </div>
    `).join("")}
  `;
}

// Función para renderizar los partidos
function renderFixture(games) {
    const box = document.getElementById("fixtureBox");

    if (!games || !games.length) {
        box.innerHTML = "<p style='opacity:.5'>Sin partidos</p>";
        return;
    }

    box.innerHTML = games.map(g => `
    <div class="matchCard ${g.live ? "liveMatch" : ""}">
        <span class="teamSide">
            <img src="https://api.promiedos.com.ar/images/team/${g.homeLogo}/1" class="teamLogo">
            ${g.home}
        </span>

        <span class="matchScore">
            ${g.live ? "● " : ""}${g.score}
        </span>

        <span class="teamSide">
            ${g.away}
            <img src="https://api.promiedos.com.ar/images/team/${g.awayLogo}/1" class="teamLogo">
        </span>

        <div class="matchStatus">
            ${g.status}
        </div>
    </div>
    `).join("");
}

// Función para cargar los datos desde la API de Supabase
async function loadData() {
    const { data, error } = await sb.functions.invoke("api-promiedos");

    if (error) {
        console.error(error);
        return;
    }

    console.log("DATA:", data); // debug

    // Renderizamos las zonas y los fixtures
    renderZona("zonaA", "Zona A", data.zonaA);
    renderZona("zonaB", "Zona B", data.zonaB);
    renderFixture(data.fixture); // Los fixtures de la fecha actual
}

// Llamamos a la función para cargar los datos al iniciar
loadData();