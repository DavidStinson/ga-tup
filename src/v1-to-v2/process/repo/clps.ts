// types
import { Data, Msgs, ClpFile } from "../../types.js"

// local
import { processGoodItem, processFileWithHeading } from "./helpers.js"

// do the thing
function process(iD: Data): Msgs {
  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.dirs.clps)
  iD.repoMsgs = processCanvasLandingPages(
    iD.repoMsgs,
    iD.files.clps,
    iD.module.meta.containsFallbackClp,
    iD.cliOptions.verbose,
  )

  return iD.repoMsgs
}

function processCanvasLandingPages(
  msgs: Msgs,
  files: ClpFile[],
  fallbackPage: boolean,
  verbose: boolean,
): Msgs {
  const noClpMsg = "No Canvas landing pages were found."
  const oneClpMsg = "There is 1 Canvas landing page."
  const multipleClpMsg = `There are ${files.length} Canvas landing pages.`
  const noFallbackMsg = `No fallback canvas landing page was found.
   It will be created, but manual migration will be required.`

  if (!files.length) {
    msgs.warnings.push(noClpMsg)
  } else if (files.length === 1) {
    msgs.successes.push(oneClpMsg)
  } else if (files.length > 1) {
    msgs.successes.push(multipleClpMsg)
  }

  if (!fallbackPage) msgs.warnings.push(noFallbackMsg)

  files.forEach((file) => {
    msgs = processGoodItem(msgs, file)
    msgs = processFileWithHeading(msgs, file, verbose)
  })

  return msgs
}

export { process }
