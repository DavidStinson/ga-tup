// local
import {
  buildDefaultLayout,
  buildRootReadme,
  buildVideoHub,
  buildReleaseNotes,
  buildInstructorGuide,
  buildReferences,
} from "./file-build.js"

// types
import { Data } from "../../types.js"

async function build(iD: Data) {
  iD.files.defaultLayout = buildDefaultLayout(iD)
  iD.files.rootReadme = buildRootReadme(iD)
  iD.files.videoHub = await buildVideoHub(iD)
  iD.files.releaseNotes = buildReleaseNotes(iD)
  iD.files.instructorGuide = await buildInstructorGuide(iD)
  iD.files.references = await buildReferences(iD)

  return iD
}

export { build }
