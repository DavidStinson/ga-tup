// node
import path from "path";
// npm
import { titleCase } from "title-case";
import { camelCase } from "change-case";
// local
import { fixCommonWords } from "./helpers.js";
function getData(module) {
    const moduleDir = path.basename(path.resolve());
    const noDashName = titleCase(moduleDir).replaceAll("-", " ");
    const dirNameTitleCase = fixCommonWords(noDashName);
    return {
        ...module,
        dirName: moduleDir,
        dirNameTitleCase: dirNameTitleCase,
        dirNameCamelCase: camelCase(moduleDir),
    };
}
export { getData };
