// node
import os from "node:os";
// npm
import { confirm } from "@inquirer/prompts";
async function promptContinue(msg) {
    try {
        if (!(await confirm({ message: msg })))
            process.exit(0);
    }
    catch (error) {
        process.exit(0);
    }
}
function getMlNamesForConsole(mls) {
    let mlNames = "";
    mls.forEach((ml) => {
        mlNames += `  ${ml.dirNameTitleCase}${os.EOL}`;
    });
    return mlNames.trimStart();
}
export { promptContinue, getMlNamesForConsole };
