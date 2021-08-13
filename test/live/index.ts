import { options } from "stratum/options";
import { RealPlayer } from "stratum/player";
import { PathInfo, Player } from "stratum/stratum";
import { RealZipFS } from "zipfs/realZipfs";

(window as any).selectFile = () => {
    document.getElementById("zipdrop")?.click();
};

function getStringQueryVar(variable: string) {
    return new URLSearchParams(window.location.search).get(variable);
}

window.addEventListener("load", () => {
    options.iconsLocation = "./data/icons";
    const dropzoneContainerElem = document.getElementById("dropzone_container") as HTMLElement;
    const dropzoneStatusElem = document.getElementById("dropzone_status") as HTMLElement;
    const dropzoneStatusOrigText = dropzoneStatusElem.innerHTML;
    const mainWindowContainerElem = document.getElementById("main_window_container") as HTMLElement;

    const optionsFastComputing = document.getElementById("options_fast_computing") as HTMLInputElement;
    const optionsNolib = document.getElementById("options_nolib") as HTMLInputElement;

    const playerPlayElem = document.getElementById("player_play") as HTMLButtonElement;
    const playerPauseElem = document.getElementById("player_pause") as HTMLButtonElement;
    const playerStepElem = document.getElementById("player_step") as HTMLButtonElement;

    let project: Player | null = null;

    const removeCurrentProject = () => {
        playerPlayElem.disabled = true;
        playerStepElem.disabled = true;
        project = null;
        mainWindowContainerElem.innerHTML = "";
    };

    const updateControls = () => {
        const isClosed = project?.state === "closed" || project?.state === "error";
        playerPlayElem.value = isClosed ? "Играть" : "Стоп";
        playerPauseElem.value = project?.state === "paused" ? "Продолжить" : "Пауза";
        playerPauseElem.disabled = isClosed;
        dropzoneContainerElem.hidden = !isClosed;
    };

    const updateOptions = () => {
        project?.speed(optionsFastComputing.checked ? "fast" : "smooth", 4);
    };

    const handleClick = ({ target }: Event) => {
        if (!project) return;
        switch (target) {
            case playerPlayElem:
                project.state === "closed" ? project.play() : project.close();
                break;
            case playerPauseElem:
                project.state === "paused" ? project.continue() : project.pause();
                break;
            case playerStepElem:
                (project.state === "playing" ? project : project.play()).pause().step();
                break;
        }
        updateControls();
    };
    playerPlayElem.addEventListener("click", handleClick);
    playerPauseElem.addEventListener("click", handleClick);
    playerStepElem.addEventListener("click", handleClick);

    let projectLoading = false;
    let stdLib: RealZipFS | undefined;
    const loadProject = async (files: FileList | Blob[], fromDropOrSelect: boolean) => {
        if (projectLoading || (project && project.state !== "closed") || !files || files.length === 0) return;
        if (fromDropOrSelect) {
            // Убираем project из QS, т.к. проект загружен не из папки projects
            window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
        projectLoading = true;
        dropzoneStatusElem.innerHTML = `Открываем архив${files.length > 1 ? "ы" : ""} ...`;
        if (!stdLib) {
            // подгружаем стандартную библиотеку
            stdLib = await fetch("./data/library.zip")
                .then((r) => r.blob())
                .then((b) => RealZipFS.create(b, { directory: "L:" }));
        }

        try {
            const fs = (await Promise.all(Array.from(files).map(RealZipFS.create))).reduce((a, b) => a.merge(b));

            let prjPath: PathInfo | undefined;
            const projectFiles = [...fs.files(/.+\.(prj|spj)$/i)] as PathInfo[];
            if (projectFiles.length === 0) throw new Error("Файл проекта не найден.");
            if (projectFiles.length === 1) {
                prjPath = projectFiles[0];
            } else {
                const matches = projectFiles.map((f) => f.toString()).join("\n");
                const msg = `Найдено несколько файлов проектов:\n${matches}\nВведите путь/часть пути к файлу проекта:`;
                let srch = prompt(msg, projectFiles[0].toString()) ?? "";

                // Файл: "C:\Projects\main.prj"
                // Ищем (srch): "s/MaIn"
                const norm = fs
                    .path(srch) // Нормализуем путь { vol:C, parts:[s, MaIn] }
                    .parts.join("\\") // s\MaIn
                    .toUpperCase(); // [S\MAIN]
                prjPath = projectFiles.find((f) => f.toString().toUpperCase().includes(norm)); // Ищем 1 файл, который попадает под условие.
            }
            if (!prjPath) throw new Error("Файл проекта не найден.");

            dropzoneStatusElem.innerHTML = `Загружаем проект ${prjPath} ...`;
            if (stdLib && !optionsNolib.checked) fs.merge(stdLib);

            project = await RealPlayer.create(prjPath as PathInfo, [{ type: "library", dir: fs.path("L:") }]);
            updateOptions();
            project.play(mainWindowContainerElem);

            fs.on("write", (path: string, data: BufferSource) => {
                console.log(`Запись в файл: ${path.toString()}`);
                console.log(new TextDecoder("windows-1251").decode(data));
            });
        } catch (err) {
            removeCurrentProject();
            alert(`При загрузке проекта произошла ошибка:\n${err.message}`);
            dropzoneStatusElem.innerHTML = dropzoneStatusOrigText;
            return;
        } finally {
            projectLoading = false;
        }

        project
            .on("error", (err) => {
                alert("В ходе выполнения проекта возникла ошибка:\n" + err);
                updateControls();
                removeCurrentProject();
            })
            .on("closed", () => {
                updateControls();
            })
            .on("shell", (path, args, directory, flag) => {
                if (path === "calc") {
                    window.open("https://zxcodes.github.io/Calculator/", "popup", "width=300,height=500");
                }
            })
            .on("cursorRequest", (path) => {
                switch (path.basename()) {
                    case "a.cur":
                        return "default";
                    case "b.cur":
                        return "grab";
                    case "c.cur":
                        return "grabbing";
                    default:
                        return "";
                }
            });

        updateControls();
        playerPlayElem.disabled = false;
        playerStepElem.disabled = false;
        dropzoneStatusElem.innerHTML = dropzoneStatusOrigText;
    };

    // загрузка архива дропом на окно
    const bodyElem = document.body;
    bodyElem.addEventListener("dragover", (evt) => evt.preventDefault());
    let fileAboveWindow = false;
    bodyElem.addEventListener("dragenter", ({ dataTransfer }) => {
        if (fileAboveWindow || !dataTransfer || dataTransfer.types.indexOf("Files") < 0) return;
        dropzoneStatusElem.innerHTML = "Отпустите кнопку мыши, чтобы запустить проект...";
        fileAboveWindow = true;
    });
    bodyElem.addEventListener("dragleave", ({ relatedTarget }) => {
        if (!fileAboveWindow || relatedTarget) return;
        dropzoneStatusElem.innerHTML = dropzoneStatusOrigText;
        fileAboveWindow = false;
    });
    bodyElem.addEventListener("drop", (evt) => {
        evt.preventDefault();
        dropzoneStatusElem.innerHTML = dropzoneStatusOrigText;
        fileAboveWindow = false;
        if (evt.dataTransfer) {
            loadProject(evt.dataTransfer.files, true);
        }
    });
    document.getElementById("zipdrop")?.addEventListener("change", ({ target: { files } }: any) => loadProject(files, true));

    // загрузка архива из папки projects
    const selectedProject = getStringQueryVar("project");
    if (selectedProject) {
        // prettier-ignore
        fetch(`./projects/${selectedProject}.zip`, {
            headers: {
                "for-testing-purposes": "yes",
            },
        }).then((r) => r.blob()).then((b) => loadProject([b], false));
    }
});
