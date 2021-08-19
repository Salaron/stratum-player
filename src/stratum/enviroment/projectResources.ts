import { readPrjFile } from "stratum/fileFormats/prj";
import { readSttFile, VariableSet } from "stratum/fileFormats/stt";
import { BinaryReader } from "stratum/helpers/binaryReader";
import { options } from "stratum/options";
import { ProjectArgs } from "stratum/project/project";
import { AddDirInfo, PathInfo } from "stratum/stratum";
import { LazyLibrary } from "./lazyLibrary";

export interface ProjectResources extends ProjectArgs {
    classes: LazyLibrary<number>;
}

/**
 * Загружает все ресурсы указанного проекта.
 * @param prjFile - путь к файлу проекта.
 * @param dirInfo - дополнительная информация (пути к системным библиотекам).
 */
export function loadProject(prjFile: PathInfo, dirInfo?: AddDirInfo[]): Promise<ProjectResources> {
    const addDirs = dirInfo?.filter((d) => !d.type || d.type === "library").map((d) => d.dir);
    const lib = new LazyLibrary<number>();
    return loadProjectResources(prjFile, lib, { addDirs });
}

export interface LoadArgs<T> {
    id?: T;
    addDirs?: PathInfo[];
}

export async function loadProjectResources(prjFile: PathInfo, classes: LazyLibrary<number>, args: LoadArgs<number>): Promise<ProjectResources> {
    const workDir = prjFile.resolve("..");
    const sttFile = workDir.resolve("_preload.stt");
    let [prjBuf, sttBuf] = await workDir.fs.arraybuffers([prjFile, sttFile]);
    if (!prjBuf) throw Error(`Файл проекта ${prjFile} не найден`);
    options.log(`Открываем проект ${prjFile.toString()}`);

    // Файл проекта.
    const prjInfo = readPrjFile(new BinaryReader(prjBuf, prjFile.toString()));

    const newPreloadFile = prjInfo.settings?.preloadFile;
    if (newPreloadFile) {
        sttBuf = await workDir.fs.arraybuffer(workDir.resolve(newPreloadFile));
    }

    // Файл состояния.
    let stt: VariableSet | null = null;
    if (sttBuf) {
        try {
            stt = readSttFile(new BinaryReader(sttBuf, sttFile.toString()));
        } catch (e) {
            console.warn(e);
        }
    }

    // Пути поиска имиджей, которые через запятую прописаны в настройках проекта.
    const classDirs: PathInfo[] = [workDir];
    const settingsPaths = prjInfo.settings?.classSearchPaths;
    if (settingsPaths) {
        //prettier-ignore
        const pathsSeparated = settingsPaths.split(";").map((s) => s.trim()).filter((s) => s);
        for (const localPath of pathsSeparated) {
            classDirs.push(workDir.resolve(localPath));
        }
    }

    // Имиджи.
    // await new Promise((res) => setTimeout(res, 2000));
    const pr1 = classes.add(workDir.fs, classDirs, !prjInfo.settings?.notRecursive, args.id);
    if (args.addDirs) {
        const pr2 = classes.add(workDir.fs, args.addDirs, true, args.id);
        await Promise.all([pr1, pr2]);
    } else {
        await pr1;
    }

    return { classes, dir: workDir, prjInfo, stt, filepath: prjFile.toString() };
}
