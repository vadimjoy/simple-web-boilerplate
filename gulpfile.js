const Fontmin = require("fontmin");

function otf2ttf(cb) {
    return new Fontmin()
        .src("./src/fonts/initial/**/*.otf")
        .use(Fontmin.otf2ttf())
        .dest("./src/fonts/initial").run(cb);
}

function ttf2web(cb) {
    return new Fontmin()
        .src("./src/fonts/initial/**/*.ttf")
        .use(Fontmin.css({
            fontPath: "../fonts/"
        }))
        .use(Fontmin.ttf2eot())
        .use(Fontmin.ttf2woff({
            deflate: true
        }))
        .use(Fontmin.ttf2svg())
        .dest("./src/fonts/generated").run(cb);
}

exports.otf2ttf = otf2ttf;
exports.ttf2web = ttf2web;
