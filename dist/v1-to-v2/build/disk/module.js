// node
import util from "node:util";
import { exec } from "node:child_process";
// data setup
const execAsync = util.promisify(exec);
async function createConfig(iD) {
    if (!iD.env.isPklInstalled)
        return false;
    try {
        const { stdout, stderr } = await execAsync("pkl eval -f json ./internal-resources/data/config.pkl -o %{moduleDir}/%{moduleName}.%{outputFormat}");
        if (stderr)
            throw new Error(stderr);
        return true;
    }
    catch (error) {
        return false;
    }
}
export { createConfig };
