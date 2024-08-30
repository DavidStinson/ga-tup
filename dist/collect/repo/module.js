// node
import path from "path";
// npm
import { titleCase } from "title-case";
import { camelCase } from "change-case";
// local
import { fixCommonWords } from "./helpers.js";
function getData(module) {
    try {
        const moduleDir = path.basename(path.resolve());
        const noDashName = titleCase(moduleDir).replaceAll("-", " ");
        const dirNameTitleCase = fixCommonWords(noDashName);
        return {
            ...module,
            headline: dirNameTitleCase,
            dirName: moduleDir,
            dirNameTitleCase: dirNameTitleCase,
            dirNameCamelCase: camelCase(moduleDir),
        };
    }
    catch (error) {
        return module;
    }
}
export { getData };
