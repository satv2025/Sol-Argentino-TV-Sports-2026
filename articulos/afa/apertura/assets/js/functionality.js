/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", cargarArticulo);

/* =====================================================
   SUPABASE
===================================================== */
const sb = supabase.createClient(
    "https://api.solargentinotv.com.ar",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemd4dmtlZHNkampoenp5eXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MzQwOTAsImV4cCI6MjA4NTExMDA5MH0.RgFghlZVV4Ww27rfh96nTiafDwRu9jtC3S6Y6aFdIxE"
);

const $ = (id) => document.getElementById(id);

/* =====================================================
   HELPERS
===================================================== */
function escapeHtml(s = "") {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function buildPlayer(videoUrl) {
    const vttUrl = videoUrl.replace(/\.[^/.]+$/, ".vtt");

    return `
    <div class="video-wrapper">
      <media-player src="${videoUrl}" playsinline preload="metadata">
        <media-provider></media-provider>
        <media-video-layout thumbnails="${vttUrl}"></media-video-layout>
      </media-player>
    </div>
  `;
}

/* =====================================================
   DROPDOWN RENDER
===================================================== */
function groupVideosBySignal(videos) {
    const groups = {};
    for (const v of videos) {
        if (!v.grupo) continue;
        const key = v.grupo;
        if (!groups[key]) {
            groups[key] = {
                id: key,
                label: v.label_grupo || key,
                videos: []
            };
        }
        groups[key].videos.push(v);
    }

    for (const k of Object.keys(groups)) {
        groups[k].videos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }

    return groups;
}

function renderSignalsDropdownHTML({ title, groups, dropdownId }) {
    const keys = Object.keys(groups);

    if (!keys.length) {
        return `<div class="signals-empty">No hay videos cargados para señales.</div>`;
    }

    const firstKey = keys[0];
    const firstLabel = groups[firstKey]?.label || firstKey;

    const itemsHtml = keys
        .map((k) => `
            <div 
                class="signalsDropdownItem" 
                data-value="${escapeHtml(k)}"
            >
                ${escapeHtml(groups[k].label)}
            </div>
        `)
        .join("");

    return `
    <div class="signalsWrap" id="${dropdownId}">
      <div class="signalsTop">
        <div class="signalsTitle">${escapeHtml(title || "Elegí la señal")}</div>

        <div class="signalsDropdown" data-open="false">
          <button type="button" class="signalsDropdownBtn" data-value="${escapeHtml(firstKey)}">
            <span class="signalsDropdownBtnText">${escapeHtml(firstLabel)}</span>
            <span class="signalsDropdownArrow">▾</span>
          </button>

          <div class="signalsDropdownMenu">
            ${itemsHtml}
          </div>
        </div>
      </div>

      <div class="signalsVideos"></div>
    </div>
  `;
}

function paintSignalVideos(dropdownId, groups, signalId) {
    const wrap = document.getElementById(dropdownId);
    if (!wrap) return;

    const box = wrap.querySelector(".signalsVideos");
    const g = groups[signalId];

    if (!g || !g.videos.length) {
        box.innerHTML = `<div class="signals-empty">No hay videos para esta señal.</div>`;
        return;
    }

    box.innerHTML = g.videos.map(v => buildPlayer(v.url)).join("");
}

function initSignalsDropdown(dropdownId, groups) {
    const wrap = document.getElementById(dropdownId);
    if (!wrap) return;

    const dropdown = wrap.querySelector(".signalsDropdown");
    const btn = wrap.querySelector(".signalsDropdownBtn");
    const btnText = wrap.querySelector(".signalsDropdownBtnText");
    const items = wrap.querySelectorAll(".signalsDropdownItem");

    const initialValue = btn?.dataset.value;
    if (initialValue) {
        paintSignalVideos(dropdownId, groups, initialValue);
    }

    btn?.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.dataset.open === "true";
        dropdown.dataset.open = isOpen ? "false" : "true";
    });

    items.forEach(item => {
        item.addEventListener("click", () => {
            const value = item.dataset.value;
            const label = item.textContent.trim();

            btn.dataset.value = value;
            btnText.textContent = label;
            dropdown.dataset.open = "false";

            paintSignalVideos(dropdownId, groups, value);
        });
    });

    document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) {
            dropdown.dataset.open = "false";
        }
    });
}

/* =====================================================
   LOAD ARTICLE
===================================================== */
async function cargarArticulo() {
    try {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");
        if (!id) return;

        const { data: art, error } = await sb
            .from("articulos")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !art) {
            console.error("Artículo no encontrado");
            return;
        }

        document.title = `${art.titulo} | SATV Sports`;
        $("h1article").textContent = art.titulo;

        const customCSSFileName = `${id}.css`;
        const customHref = `https://sports.solargentinotv.com.ar/articulos/afa/apertura/assets/css/${customCSSFileName}`;

        const old = document.getElementById("articleCustomCss");
        if (old) old.remove();

        const link = document.createElement("link");
        link.id = "articleCustomCss";
        link.rel = "stylesheet";
        link.href = customHref;
        document.head.appendChild(link);

        if (art.imagen) {
            $("imgArticle").src = art.imagen;
            $("imgArticle").style.display = "block";
        } else {
            $("imgArticle").style.display = "none";
        }

        let html = art.contenido || "";

        if (html && !html.includes("<p>")) {
            html = html
                .split("\n\n")
                .map(t => `<p>${t.trim()}</p>`)
                .join("");
        }

        const { data: videosAll = [] } = await sb
            .from("articulos_videos")
            .select("*")
            .eq("articulo_id", id)
            .order("grupo", { ascending: true })
            .order("orden", { ascending: true });

        const hasSDropdown = html.includes("{s-dropdown}") || html.includes("{s-dropdown}".toUpperCase());
        const usaDropdown = !!art.usa_dropdown || hasSDropdown;

        if (usaDropdown) {
            const groups = groupVideosBySignal(videosAll);

            const dropdownId = `signals_${id}`;
            const dropdownHTML = renderSignalsDropdownHTML({
                title: art.dropdown_titulo || "Elegí la señal",
                groups,
                dropdownId
            });

            html = html.replaceAll("{s-dropdown}", dropdownHTML);

            $("contenidoArticle").innerHTML = html;

            initSignalsDropdown(dropdownId, groups);
            return;
        }

        let out = html;
        const normalVideos = videosAll.filter(v => !v.grupo);

        normalVideos.forEach(v => {
            const player = buildPlayer(v.url);
            const regex = new RegExp(`\\{video-${v.orden}\\}`, "g");
            out = out.replace(regex, player);
        });

        $("contenidoArticle").innerHTML = out;

    } catch (err) {
        console.error("Error cargando artículo:", err);
    }
}