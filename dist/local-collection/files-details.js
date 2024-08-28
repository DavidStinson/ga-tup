// node
import { readFile } from "fs/promises";
// types
import { File } from "../types.js";
// do the thing
async function getData(paths) {
    const filesContent = await Promise.allSettled(paths.map(async (path) => {
        return await readFile(path, "utf-8");
    }));
    return paths.map((path, idx) => {
        const fileContent = filesContent[idx];
        if (fileContent.status === "fulfilled") {
            return new File({ path: path, fileContent: fileContent });
        }
        else {
            return {
                type: "file",
                path: path,
                oldFile: "",
                newFile: "",
                canUpdateHeader: false,
                isFound: false,
            };
        }
    });
}
export { getData };
