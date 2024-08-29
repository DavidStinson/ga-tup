// node
import util from "util";
import { exec } from "child_process";
// data setup
const execAsync = util.promisify(exec);
async function collect(iD) {
    iD.env.isPklInstalled = await getPklInstalled();
    return iD;
}
async function getPklInstalled() {
    try {
        const { stdout } = await execAsync("pkl --version");
        return stdout ? true : false;
    }
    catch (error) {
        return false;
    }
}
export { collect };
