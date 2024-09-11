// node
import { mkdir, writeFile } from "node:fs/promises";
async function writeDirToDisk(desiredPath) {
    try {
        await mkdir(desiredPath, { recursive: true });
        return true;
    }
    catch (error) {
        return false;
    }
}
async function writeFileToDisk(desiredPath, content) {
    try {
        await writeFile(desiredPath, content);
        return true;
    }
    catch (error) {
        return false;
    }
}
export { writeDirToDisk, writeFileToDisk };
