// local
import { process as processTemplateItems } from "./template-items.js";
import { process as processClps } from "./clps.js";
import { process as processMicrolessons } from "./mls.js";
import { process as processAssets } from "./assets.js";
// do the thing
function process(iD) {
    iD.repoMsgs = processTemplateItems(iD);
    iD.repoMsgs = processClps(iD);
    iD.repoMsgs = processMicrolessons(iD);
    iD.repoMsgs = processAssets(iD);
    return iD;
}
export { process };
