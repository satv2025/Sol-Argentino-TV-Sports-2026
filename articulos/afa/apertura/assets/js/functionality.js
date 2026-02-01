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

const $ = id => document.getElementById(id);


/* =====================================================
   LOAD ARTICLE
===================================================== */

async function cargarArticulo() {

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

    document.title = art.titulo + " | SATV Sports";

    $("h1article").textContent = art.titulo;

    if (art.imagen) {
        $("imgArticle").src = art.imagen;
    } else {
        $("imgArticle").style.display = "none";
    }


    /* =============================
       CONTENIDO BASE
    ============================= */

    let html = art.contenido || "";

    if (!html.includes("<p>")) {
        html = html
            .split("\n\n")
            .map(t => `<p>${t}</p>`)
            .join("");
    }


    /* =============================
       VIDEOS
    ============================= */

    const { data: videos = [] } = await sb
        .from("articulos_videos")
        .select("*")
        .eq("articulo_id", id)
        .order("orden");

    videos.forEach(v => {

        const videoUrl = v.url;
        const vttUrl = videoUrl.replace(/\.[^/.]+$/, ".vtt");

        const player = `
      <div class="video-wrapper">
        <media-player src="${videoUrl}" playsinline preload="metadata">
          <media-provider></media-provider>
          <media-video-layout thumbnails="${vttUrl}"></media-video-layout>
        </media-player>
      </div>
    `;

        const regex = new RegExp(`\\{video-${v.orden}\\}`, "g");

        if (regex.test(html))
            html = html.replace(regex, player);
        else
            html += player;
    });

    $("contenidoArticle").innerHTML = html;
}