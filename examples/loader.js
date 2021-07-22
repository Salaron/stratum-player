function runProject(name, fast, fname) {
    if (document.body) document.body.innerHTML = "Загрузка данных..."

    stratum.options.iconsLocation = "../data/icons";
    const urls = [`./${name}.zip`, "../data/library.zip"];
    const promises = urls.map(url => fetch(url).then(res => res.blob()).then(stratum.unzip))

    Promise.all(promises)
        .then((fileSystems) => {
            if (document.body) document.body.innerHTML = "Проект открывается..."
            const path = fileSystems[0].prj(fname)
            const fs = fileSystems.reduce((a, b) => a.merge(b));
            return stratum.player(path, [{ type: "library", dir: fs.path("library") }]);
        })
        .then((player) => {
            const cb = () => {
                document.body.innerHTML = "";
                player
                    .speed(fast ? "fast" : "smooth", 4)
                    .on("closed", () => history.back())
                    .on("error", (err) => alert(err))
                    .play(document.body);
            }
            if (document.body) cb();
            else window.addEventListener("load", cb);
        })
        .catch((err) => {
            console.error(err);
            if (document.body) document.body.innerHTML = "Не удалось запустить проект :(";
        })
}

