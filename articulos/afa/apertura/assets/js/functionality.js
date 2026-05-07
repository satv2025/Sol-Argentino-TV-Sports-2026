/* ===========================
   assets/js/functionality.js
   =========================== */

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
        .map(
            (k) => `
        <div class="signalsDropdownItem" data-value="${escapeHtml(k)}">
          ${escapeHtml(groups[k].label)}
        </div>
      `
        )
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

    box.innerHTML = g.videos.map((v) => buildPlayer(v.url)).join("");
}

function initSignalsDropdown(dropdownId, groups) {
    const wrap = document.getElementById(dropdownId);
    if (!wrap) return;

    const dropdown = wrap.querySelector(".signalsDropdown");
    const btn = wrap.querySelector(".signalsDropdownBtn");
    const btnText = wrap.querySelector(".signalsDropdownBtnText");
    const items = wrap.querySelectorAll(".signalsDropdownItem");

    const initialValue = btn?.dataset.value;
    if (initialValue) paintSignalVideos(dropdownId, groups, initialValue);

    btn?.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.dataset.open = dropdown.dataset.open === "true" ? "false" : "true";
    });

    items.forEach((item) => {
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
        if (!wrap.contains(e.target)) dropdown.dataset.open = "false";
    });
}

/* =====================================================
   RENDER STRUCTURE
   - Header SIN foto
   - Foto SOLO dentro del artículo (si hay)
===================================================== */
function renderArticleShell({ photoUrl, title, bodyHtml }) {
    const photo = photoUrl
        ? `
      <figure class="articlePhoto">
        <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(title || "")}">
      </figure>
    `
        : "";

    return `
    <div class="articleShell">
      ${photo}
      <div class="articleProse">
        ${bodyHtml || ""}
      </div>
    </div>
  `;
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
        const h1 = $("h1article");
        if (h1) h1.textContent = art.titulo || "";

        /* =====================================================
           CSS POR ID (Vercel) — como lo tenías vos
        ====================================================== */
        const customHref = `/articulos/afa/apertura/assets/css/${encodeURIComponent(id)}.css`;

        let custom = document.getElementById("articleCustomCss");
        if (!custom) {
            custom = document.createElement("link");
            custom.id = "articleCustomCss";
            custom.rel = "stylesheet";
            document.head.appendChild(custom);
        }
        custom.href = customHref;

        /* =====================================================
           HEADER SIN FOTO (siempre)
        ====================================================== */
        const heroImg = $("imgArticle");
        if (heroImg) {
            heroImg.removeAttribute("src");
            heroImg.style.display = "none";
        }

        /* =====================================================
           CONTENIDO
        ====================================================== */
        let html = art.contenido || "";

        // Si viene texto plano sin <p>, lo paso a párrafos
        if (html && !html.includes("<p")) {
            html = html
                .split(/\n\s*\n/g)
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => `<p>${t}</p>`)
                .join("");
        }

        const { data: videosAll = [] } = await sb
            .from("articulos_videos")
            .select("*")
            .eq("articulo_id", id)
            .order("grupo", { ascending: true })
            .order("orden", { ascending: true });

        const usaDropdown = !!art.usa_dropdown || /\{s-dropdown\}/i.test(html);

        const cont = $("contenidoArticle");
        if (!cont) return;

        if (usaDropdown) {
            const groups = groupVideosBySignal(videosAll);

            const dropdownId = `signals_${id}`;
            const dropdownHTML = renderSignalsDropdownHTML({
                title: art.dropdown_titulo || "Elegí la señal",
                groups,
                dropdownId
            });

            html = html.replace(/\{s-dropdown\}/gi, dropdownHTML);

            cont.innerHTML = renderArticleShell({
                photoUrl: art.imagen || "",
                title: art.titulo || "",
                bodyHtml: html
            });
            cont.classList.add("hasShell");

            initSignalsDropdown(dropdownId, groups);
            return;
        }

        // Videos normales {video-n}
        let out = html;
        const normalVideos = videosAll.filter((v) => !v.grupo);

        normalVideos.forEach((v) => {
            const player = buildPlayer(v.url);
            const regex = new RegExp(`\\{video-${v.orden}\\}`, "g");
            out = out.replace(regex, player);
        });

        cont.innerHTML = renderArticleShell({
            photoUrl: art.imagen || "",
            title: art.titulo || "",
            bodyHtml: out
        });
        cont.classList.add("hasShell");

    } catch (err) {
        console.error("Error cargando artículo:", err);
    }
}