/* =====================================================
   SATV TABLA + FIXTURE PRO MAX
   TODO EN 1 ARCHIVO
===================================================== */


/* =====================================================
   ESCUDOS (Promiedos CDN)
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
    `https://api.promiedos.com.ar/images/team/${logos[name] || "igg"}/1`;


/* =====================================================
   DATOS ZONAS
===================================================== */

const zonaAData = [
    { team: "Platense", pts: 7, pj: 3, gol: "4:2", g: 2, e: 1, p: 0 },
    { team: "Vélez", pts: 7, pj: 3, gol: "4:2", g: 2, e: 1, p: 0 },
    { team: "Lanús", pts: 6, pj: 2, gol: "5:3", g: 2, e: 0, p: 0 },
    { team: "San Lorenzo", pts: 6, pj: 3, gol: "4:3", g: 2, e: 0, p: 1 },
    { team: "Estudiantes", pts: 4, pj: 2, gol: "3:2", g: 1, e: 1, p: 0 },
    { team: "Defensa", pts: 4, pj: 2, gol: "1:0", g: 1, e: 1, p: 0 },
    { team: "Independiente", pts: 3, pj: 3, gol: "3:3", g: 0, e: 3, p: 0 },
    { team: "Boca Jrs.", pts: 3, pj: 2, gol: "2:2", g: 1, e: 0, p: 1 },
    { team: "Gimnasia (M)", pts: 3, pj: 2, gol: "1:1", g: 1, e: 0, p: 1 },
    { team: "Talleres", pts: 3, pj: 3, gol: "4:5", g: 1, e: 0, p: 2 },
    { team: "Newell's", pts: 1, pj: 2, gol: "2:3", g: 0, e: 1, p: 1 },
    { team: "Unión", pts: 1, pj: 2, gol: "1:2", g: 0, e: 1, p: 1 },
    { team: "Central Córdoba", pts: 1, pj: 3, gol: "0:2", g: 0, e: 1, p: 2 },
    { team: "Instituto", pts: 0, pj: 2, gol: "1:3", g: 0, e: 0, p: 2 },
    { team: "Riestra", pts: 0, pj: 2, gol: "0:2", g: 0, e: 0, p: 2 }
];

const zonaBData = [
    { team: "River", pts: 6, pj: 2, gol: "3:0", g: 2, e: 0, p: 0 },
    { team: "Ind. Rivadavia", pts: 6, pj: 2, gol: "4:2", g: 2, e: 0, p: 0 },
    { team: "Tigre", pts: 4, pj: 2, gol: "3:1", g: 1, e: 1, p: 0 },
    { team: "Belgrano", pts: 4, pj: 2, gol: "3:2", g: 1, e: 1, p: 0 },
    { team: "Argentinos", pts: 4, pj: 2, gol: "1:0", g: 1, e: 1, p: 0 },
    { team: "Central", pts: 3, pj: 2, gol: "3:3", g: 1, e: 0, p: 1 },
    { team: "Sarmiento", pts: 3, pj: 2, gol: "1:1", g: 1, e: 0, p: 1 },
    { team: "Gimnasia", pts: 3, pj: 2, gol: "2:3", g: 1, e: 0, p: 1 },
    { team: "Aldosivi", pts: 2, pj: 2, gol: "0:0", g: 0, e: 2, p: 0 },
    { team: "Huracán", pts: 2, pj: 3, gol: "3:4", g: 0, e: 2, p: 1 },
    { team: "Atl. Tucumán", pts: 2, pj: 3, gol: "2:3", g: 0, e: 2, p: 1 },
    { team: "Banfield", pts: 1, pj: 2, gol: "1:2", g: 0, e: 1, p: 1 },
    { team: "Barracas", pts: 1, pj: 2, gol: "0:1", g: 0, e: 1, p: 1 },
    { team: "Estudiantes RC", pts: 1, pj: 2, gol: "0:2", g: 0, e: 1, p: 1 },
    { team: "Racing", pts: 0, pj: 2, gol: "2:4", g: 0, e: 0, p: 2 }
];


/* =====================================================
   FIXTURE CON ESCUDOS
===================================================== */

const fixtureData = {
    "Fecha 3": [
        ["San Lorenzo", "Central Córdoba", "1-0", "Final"],
        ["Independiente", "Vélez", "1-1", "Final"],
        ["Atl. Tucumán", "Huracán", "1-1", "Final"],
        ["Talleres", "Platense", "1-2", "Final"],
        ["Barracas", "Riestra", "17:00", "Próximo"],
        ["Boca Jrs.", "Newell's", "19:15", "Próximo"],
        ["Central", "River", "21:30", "Próximo"],
        ["Gimnasia", "Aldosivi", "17:30", "Próximo"],
        ["Defensa", "Estudiantes", "17:30", "Próximo"],
        ["Tigre", "Racing", "19:45", "Próximo"],
        ["Argentinos", "Belgrano", "22:00", "Próximo"],
        ["Unión", "Gimnasia (M)", "22:00", "Próximo"],
        ["Banfield", "Estudiantes RC", "19:00", "Próximo"],
        ["Ind. Rivadavia", "Sarmiento", "21:15", "Próximo"],
        ["Instituto", "Lanús", "21:15", "Próximo"]
    ]
};


/* =====================================================
   RENDER TABLAS
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
<span>${dg > 0 ? `+${dg}` : dg}</span>
<span>${t.g}</span>
<span>${t.e}</span>
<span>${t.p}</span>

</div>`;
    }).join("")}
`;
}


/* =====================================================
   FIXTURE RENDER
===================================================== */

const fechas = Object.keys(fixtureData);
let current = 0;

function renderFixture() {

    const fecha = fechas[current];

    document.getElementById("fechaTrigger").firstChild.nodeValue = fecha + " ";

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


/* =====================================================
   DROPDOWN
===================================================== */

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
   INIT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderZona("zonaA", "Zona A", zonaAData);
    renderZona("zonaB", "Zona B", zonaBData);
    initDropdown();
});