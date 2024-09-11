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
        // Not logging anything more here because this is called only if the user
        // quits the program.
        console.log("Exiting...");
        process.exit(0);
    }
}
function getMlNamesForConsole(mls) {
    let mlNames = "";
    mls.forEach((ml, idx) => {
        const isLast = idx === mls.length - 1;
        mlNames += `    ${ml.displayName}${isLast ? "" : os.EOL}`;
    });
    return mlNames.trimStart();
}
export { promptContinue, getMlNamesForConsole };
