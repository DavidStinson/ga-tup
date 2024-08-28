// npm
import { confirm } from "@inquirer/prompts";
// local
import { verifyData as verifyLocalData } from "./verify-local.js";
// do the thing
async function promptContinue(msg) {
    try {
        if (!(await confirm({ message: msg })))
            process.exit(0);
    }
    catch (error) {
        process.exit(0);
    }
}
async function verify(iD) {
    return await verifyLocalData(iD);
}
export { promptContinue, verify };
