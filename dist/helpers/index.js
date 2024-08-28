// node
import os from "node:os";
const dictionary = {
    Javascript: "JavaScript",
    Github: "GitHub",
};
// do the thing
function fixCommonWords(str) {
    Object.keys(dictionary).forEach((word) => {
        str = str.replaceAll(word, dictionary[word]);
    });
    return str;
}
function getMlNamesForConsole(mls) {
    let mlNames = "";
    mls.forEach((ml) => {
        mlNames += `  ${ml.dirNameTitleCase}${os.EOL}`;
    });
    return mlNames.trimStart();
}
export { fixCommonWords, getMlNamesForConsole };
