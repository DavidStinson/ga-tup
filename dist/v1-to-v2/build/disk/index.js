// local
import { build as buildDirs } from "./dirs.js";
import { build as buildFiles } from "./files.js";
import { remove as removeAssets } from "./assets.js";
import { createConfig } from "./module.js";
async function build(iD) {
    iD.dirs = await buildDirs(iD);
    iD.files = await buildFiles(iD);
    iD.assets = await removeAssets(iD);
    iD.module.meta.createdConfigJson = await createConfig(iD);
    return iD;
}
export { build };
