/* =====================================================
   SUPABASE
===================================================== */

const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

const $ = id => document.getElementById(id);



/* =====================================================
   DROPDOWN IDIOMA
===================================================== */

const drop = $("droplang");

drop.onclick = () => drop.classList.toggle("open");

drop.querySelectorAll("[data-lang]").forEach(opt => {
    opt.onclick = (e) => {
        e.stopPropagation();
        $("sectionTitle").innerText =
            opt.dataset.lang === "en" ? "Sports News" : "Noticias Deportes";
        drop.querySelector(".dropSelected").innerText =
            opt.dataset.lang.toUpperCase();
        drop.classList.remove("open");
    };
});



/* =====================================================
   SLIDER PARTIDOS
===================================================== */

const matches = [
    {
        img: "https://www.365scores.com/es/news/wp-content/uploads/2025/11/photo_2025-11-09_18-23-19.jpg",
        title: "RIV – BOC",
        date: "04/2026 (a confirmar)"
    },
    {
        img: "https://www.365scores.com/es/news/wp-content/uploads/2025/02/Previa-Huracan-vs-San-Lorenzo.jpg.webp",
        title: "HUR – SLO",
        date: "08/02/2026"
    },
    {
        img: "https://www.365scores.com/es/news/wp-content/uploads/2025/03/Independiente-vs-Racing.jpg",
        title: "IND – RAC",
        date: "04/2026 (a confirmar)"
    },
    {
        img: "https://www.365scores.com/es/news/wp-content/uploads/2025/02/Previa-Newells-vs-Rosario-Central.jpg",
        title: "CEN – NOB",
        date: "01/03/2026"
    }
];

function initSlider() {

    const slider = $("matchSlider");

    matches.forEach((m, i) => {

        const slide = document.createElement("div");
        slide.className = "slide";

        slide.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.7)),url(${m.img})`;

        slide.innerHTML = `
      <div class="overlay">
        <div class="matchTitle">${m.title}</div>
        <div class="matchDate">${m.date}</div>
      </div>
    `;

        if (i === 0) slide.classList.add("active");

        slider.appendChild(slide);
    });

    const slides = document.querySelectorAll(".slide");
    let index = 0;

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, 4000);
}

initSlider();



/* =====================================================
   UTIL
===================================================== */

function slugify(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .replaceAll(" ", "-");
}



/* =====================================================
   NOTICIAS DEPORTES (MISMO FORMATO HOME)
===================================================== */

async function cargarNoticiasDeportes() {

    const { data, error } = await sb
        .from("articulos")
        .select("*")
        .eq("estado", "deportes")
        .order("fecha_creacion", { ascending: false })
        .limit(10);

    if (error) return console.error(error);

    const container = $("homeNoticias");
    container.innerHTML = "";

    data.forEach(n => {

        const date = new Date(n.fecha_creacion)
            .toISOString()
            .split("T")[0];

        const name = n.slug || slugify(n.titulo);

        const url =
            `/articulos/afa/apertura/articulo.html?date=${date}&id=${n.id}&name=${name}`;

        container.innerHTML += `
    
    <article style="
      background:#fff;
      color:#111;
      padding:20px 0;
      box-shadow:0 0 20px rgb(0 0 0 / 61%);
      border-radius:12px;
      cursor:pointer;
    " onclick="location.href='${url}'">

      <h2 style="
        font-size:28px;
        margin-bottom:14px;
        padding-left:1em;
        font-weight:700;
      ">
        ${n.titulo}
      </h2>

      <div style="display:flex;gap:20px">

        <img src="${n.imagen}" style="
          width:260px;height:160px;
          object-fit:cover;border-radius:8px;
          margin-left:1em;
        ">

        <div style="flex:1">
          <p style="font-size:16px;line-height:1.6;margin-bottom:12px">
            ${n.resumen || ""}
          </p>

          <a href="${url}" style="color:#0078d4;font-weight:bold">
            Leer más →
          </a>
        </div>

      </div>

    </article>
    `;
    });
}

cargarNoticiasDeportes();