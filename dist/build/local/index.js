// local
import { buildDefaultLayout, buildRootReadme, buildVideoHub, buildReleaseNotes, buildInstructorGuide, buildReferences, } from "./file-build.js";
async function build(iD) {
    iD.files.defaultLayout = buildDefaultLayout(iD);
    iD.files.rootReadme = buildRootReadme(iD);
    iD.files.videoHub = await buildVideoHub(iD);
    iD.files.releaseNotes = buildReleaseNotes(iD);
    iD.files.instructorGuide = await buildInstructorGuide(iD);
    iD.files.references = await buildReferences(iD);
    return iD;
}
export { build };
