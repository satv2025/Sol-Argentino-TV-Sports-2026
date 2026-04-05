const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end("Falta id");
            return;
        }

        // Lee base.css INTERNAMENTE desde el servidor
        const baseCssPath = path.join(
            process.cwd(),
            "articulos",
            "afa",
            "apertura",
            "assets",
            "css",
            "base.css"
        );

        let baseCss = "";

        if (fs.existsSync(baseCssPath)) {
            baseCss = fs.readFileSync(baseCssPath, "utf8");
        }

        // Si no querés CSS por artículo, devolvés solo base.css
        // Si después querés agregar lógica por id, la ponés acá.
        const finalCss = baseCss;

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/css; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
        res.end(finalCss);
    } catch (err) {
        console.error("Error generando CSS:", err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Error generando CSS");
    }
};