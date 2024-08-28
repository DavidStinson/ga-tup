// node
import { readFile } from "fs/promises";
// do the thing
async function getData(file) {
    try {
        const oldFile = await readFile(file.path, "utf-8");
        return {
            ...file,
            oldFile: oldFile,
            isFound: true,
            canUpdateHeader: oldFile.startsWith("# ![")
        };
    }
    catch (error) {
        return file;
    }
}
export { getData };
