/* =====================================================
   INIT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    cargarNoticiasDeportes();
});


/* =====================================================
   SUPABASE
===================================================== */

const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

const $ = id => document.getElementById(id);

/* =====================================================
   LOGOS CANALES
===================================================== */

const CHANNEL_LOGOS = {
    tnt: "assets/images/TNT Sports Premium Logo.png",
    espn: "assets/images/ESPN_Premium_logo.svg.png"
};


/* =====================================================
   SLIDER PARTIDOS
===================================================== */

const matches = [
    {
        img: "https://www.365scores.com/es/news/wp-content/uploads/2025/03/Independiente-vs-Racing.jpg",
        fecha: "13",
        home: "Independiente",
        away: "Racing",
        estadio: "Libertadores de América – Ricardo Enrique Bochini",
        ciudad: "Avellaneda, Provincia de Buenos Aires",
        hora: "17:30",
        date: "04/04/2026",
        day: "Sábado",
        transmision: {
            tnt: {
                relatos: "Pablo Giralt",
                comentarios: "Juan Pablo Varsky"
            },
            espn: {
                relatos: "Sebastián Vignolo",
                comentarios: "Diego Latorre"
            }
        }
    },
    {
        img: "assets/images/rivboc1.png",
        fecha: "15",
        home: "River Plate",
        away: "Boca Juniors",
        estadio: "Mâs Monumental - Antonio Vespucio Liberti",
        ciudad: "Núñez, Ciudad Autónoma de Buenos Aires",
        hora: "17:00",
        date: "19/04/2026",
        day: "Domingo",
        transmision: {
            tnt: {
                relatos: "Pablo Giralt",
                comentarios: "Juan Pablo Varsky"
            },
            espn: {
                relatos: "Sebastián Vignolo",
                comentarios: "Diego Latorre"
            }
        }
    }
];


/* =====================================================
   RENDER CANALES
===================================================== */

function renderCanalBadges() {
    return `
        <div class="badge canalBadge">Transmite
            <img class="canalLogo" src="${CHANNEL_LOGOS.tnt}" alt="TNT Sports Premium">
            <img class="canalLogo" src="${CHANNEL_LOGOS.espn}" alt="ESPN Premium">
        </div>
    `;
}

/* =====================================================
   RENDER TRANSMISION
===================================================== */

function renderTransmision(transmision) {
    if (!transmision) return "";

    const tntRelatos = transmision.tnt?.relatos ?? "-";
    const tntComentarios = transmision.tnt?.comentarios ?? "-";
    const espnRelatos = transmision.espn?.relatos ?? "-";
    const espnComentarios = transmision.espn?.comentarios ?? "-";

    return `
        <div class="transmisionBox">
            <div class="transmisionTitle">Transmisión</div>

            <span class="tvLine">
                <img class="tvLogoTall" src="${CHANNEL_LOGOS.tnt}" alt="TNT Sports Premium">
                <span class="tvText">
                    <span class="tvInfo">Relatos: ${tntRelatos}</span>
                    <span class="tvInfo">Comentarios: ${tntComentarios}</span>
                </span>
            </span>

            <span class="tvLine">
                <img class="tvLogoTall" src="${CHANNEL_LOGOS.espn}" alt="ESPN Premium">
                <span class="tvText">
                    <span class="tvInfo">Relatos: ${espnRelatos}</span>
                    <span class="tvInfo">Comentarios: ${espnComentarios}</span>
                </span>
            </span>
        </div>
    `;
}

/* =====================================================
   RENDER HTML DE CADA PARTIDO
===================================================== */

function renderMatchInfo(m) {
    const esFinalizado = Boolean(m.resultadofinal);

    return `
        <div class="matchFecha">Fecha ${m.fecha ?? ""}</div>

        <div class="matchTitle">
            ${m.home ?? ""} – ${m.away ?? ""}
        </div>

        <div class="matchMeta">
            <span class="stadium">Estadio: ${m.estadio ?? ""}</span>
            <span>Ciudad: ${m.ciudad ?? ""}</span>

            ${esFinalizado
            ? `
                    <span class="matchDate">Resultado final: ${m.resultadofinal}</span>
                    <span class="badge">Finalizado</span>
                `
            : `
                    <span class="matchDay">Día: ${m.day ?? ""}</span>
                    <span class="matchDate">Fecha: ${m.date ?? ""}</span>
                    <span class="matchTime">Hora: ${m.hora ?? "A confirmar"}</span>
                    ${renderCanalBadges()}
                    ${renderTransmision(m.transmision)}
                `
        }
        </div>
    `;
}


/* =====================================================
   INIT SLIDER
===================================================== */

function initSlider() {
    const slider = $("matchSlider");
    if (!slider) return;

    slider.innerHTML = "";
    const slides = [];

    matches.forEach((m, i) => {
        const slide = document.createElement("div");
        slide.className = "slide";

        slide.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.85)), url(${m.img})`;

        const img = document.createElement("img");
        img.className = "slide-img";
        img.src = m.img;
        img.alt = `${m.home} vs ${m.away}`;

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.innerHTML = renderMatchInfo(m);

        slide.appendChild(img);
        slide.appendChild(overlay);

        if (i === 0) slide.classList.add("active");

        slides.push(slide);
        slider.appendChild(slide);
    });

    if (slides.length <= 1) return;

    let index = 0;

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, 4000);
}


/* =====================================================
   UTIL
===================================================== */

const slugify = t =>
    t.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .replaceAll(" ", "-");


/* =====================================================
   NOTICIAS DEPORTES
===================================================== */

async function cargarNoticiasDeportes() {
    const container = $("homeNoticias");
    if (!container) return;

    container.innerHTML =
        `<div style="padding:20px;color:#888">Cargando noticias deportivas…</div>`;

    const { data, error } = await sb
        .from("articulos")
        .select("*")
        .eq("estado", "deportes")
        .order("fecha_creacion", { ascending: false })
        .limit(10);

    if (error) {
        console.error(error);
        container.innerHTML = "Error cargando noticias";
        return;
    }

    container.innerHTML = "";

    data.forEach(n => {
        const date = new Date(n.fecha_creacion)
            .toISOString()
            .split("T")[0];

        const name = n.slug || slugify(n.titulo);

        const url = `/articulos/afa/apertura/articulo.html?date=${date}&name=${name}&id=${n.id}`;

        const card = document.createElement("article");
        card.className = "newsCard";

        card.innerHTML = `
            <img src="${n.imagen}" alt="${n.titulo}">
            <div class="newsContent">
                <h2>${n.titulo}</h2>
                <p>${n.resumen || ""}</p>
                <a href="${url}">Leer más →</a>
            </div>
        `;

        card.addEventListener("click", () => {
            location.href = url;
        });

        container.appendChild(card);
    });
}