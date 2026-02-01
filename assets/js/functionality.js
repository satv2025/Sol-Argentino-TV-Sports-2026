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
   SLIDER PARTIDOS (crossfade pro)
===================================================== */

const matches = [
    { img: "https://www.365scores.com/es/news/wp-content/uploads/2025/11/photo_2025-11-09_18-23-19.jpg", title: "RIV – BOC", date: "04/2026 (a confirmar)" },
    { img: "https://www.365scores.com/es/news/wp-content/uploads/2025/02/Previa-Huracan-vs-San-Lorenzo.jpg.webp", title: "HUR – SLO", date: "08/02/2026" },
    { img: "https://www.365scores.com/es/news/wp-content/uploads/2025/03/Independiente-vs-Racing.jpg", title: "IND – RAC", date: "04/2026 (a confirmar)" },
    { img: "https://www.365scores.com/es/news/wp-content/uploads/2025/02/Previa-Newells-vs-Rosario-Central.jpg", title: "CEN – NOB", date: "01/03/2026" }
];

function initSlider() {

    const slider = $("matchSlider");
    if (!slider) return;

    const slides = [];

    matches.forEach((m, i) => {

        const slide = document.createElement("div");
        slide.className = "slide";

        slide.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.85)),url(${m.img})`;

        slide.innerHTML = `
      <div class="overlay">
        <div class="matchTitle">${m.title}</div>
        <div class="matchDate">${m.date}</div>
      </div>
    `;

        if (i === 0) slide.classList.add("active");

        slides.push(slide);
        slider.appendChild(slide);
    });

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
   NOTICIAS DEPORTES (1 imagen horizontal neon)
===================================================== */

async function cargarNoticiasDeportes() {

    const container = $("homeNoticias");
    if (!container) return;

    /* loading skeleton */
    container.innerHTML = `
    <div style="padding:20px;color:#888">Cargando noticias deportivas…</div>
  `;

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

        const url =
            `/articulos/afa/apertura/articulo.html?date=${date}&id=${n.id}&name=${name}`;

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

        card.addEventListener("click", () => location.href = url);

        container.appendChild(card);
    });
}