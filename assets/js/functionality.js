/* ================= SUPABASE ================= */

const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "TU_PUBLIC_KEY"
);

const $ = id => document.getElementById(id);


/* ================= DROPDOWN LANG ================= */

const drop = $("droplang");

drop.onclick = () =>
    drop.classList.toggle("open");

drop.querySelectorAll("[data-lang]").forEach(opt => {
    opt.onclick = (e) => {
        e.stopPropagation();
        setLang(opt.dataset.lang);
        drop.querySelector(".dropSelected").innerText =
            opt.dataset.lang.toUpperCase();
        drop.classList.remove("open");
    };
});


/* ================= IDIOMA ================= */

const dict = {
    es: { latest: "Últimas noticias" },
    en: { latest: "Latest news" }
};

function setLang(lang) {
    $("sectionTitle").innerText = dict[lang].latest;
}


/* ================= CARGAR DEPORTES ================= */

async function loadSports() {

    const { data } = await sb
        .from("articulos")
        .select("*")
        .eq("estado", "deportes")
        .order("fecha_creacion", { ascending: false });

    const grid = $("articlesGrid");
    const featured = $("featured");

    grid.innerHTML = "";

    if (!data.length) return;

    /* 🔥 PRIMERA = DESTACADA */
    const first = data.shift();

    featured.classList.remove("hidden");
    featured.style.backgroundImage =
        `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.8)),url(${first.imagen})`;

    featured.innerHTML = `<h1>${first.titulo}</h1>`;
    featured.onclick = () =>
        location.href = "/nota.html?slug=" + first.slug;


    /* 🔥 RESTO GRID */
    data.forEach(a => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
      <img src="${a.imagen}" class="thumb">
      <div class="content">
        <div class="title">${a.titulo}</div>
        <div class="summary">${a.resumen || ""}</div>
      </div>
    `;

        card.onclick = () => location.href = "/nota.html?slug=" + a.slug;

        grid.appendChild(card);
    });
}

loadSports();