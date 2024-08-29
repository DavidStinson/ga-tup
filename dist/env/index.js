// node
import util from "util";
import { exec } from "child_process";
const execAsync = util.promisify(exec);
async function collectAndProcess(iD) {
    iD.env = await collect(iD.env);
    iD.envMsgs = process(iD);
    return iD;
}
async function collect(env) {
    env.isPklInstalled = await getPklInstalled();
    return env;
}
// do the thing
async function getPklInstalled() {
    try {
        const { stdout } = await execAsync("pkl --version");
        return stdout ? true : false;
    }
    catch (error) {
        return false;
    }
}
function process(iD) {
    iD.envMsgs = pklFound(iD.envMsgs, iD.env.isPklInstalled);
    return iD.envMsgs;
}
function pklFound(msgs, isPklInstalled) {
    if (isPklInstalled) {
        msgs.successes.push("Pkl is installed. A config.json file will be created with a fallback course. All other courses will need to be manually migrated.");
    }
    else {
        msgs.failures.push("Pkl is not installed. A config.json file will not be created for this module.");
    }
    return msgs;
}
export { collectAndProcess };
