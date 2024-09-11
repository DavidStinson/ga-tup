// local
import { build as buildDirs } from "./dirs.js";
async function build(iD) {
    iD.dirs = await buildDirs(iD);
    return iD;
}
export { build };
