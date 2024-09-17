// types
import type { Data, ResultMsgs } from "../../types.js"

// local
import { processTemplateDir, processHeading } from "./helpers.js"

// do the thing
function process(iD: Data): ResultMsgs {
  const { dirs, cliOptions, module, files } = iD

  const fallbackClpCreatedMsg = `No fallback canvas landing page was found, so one was created.
    You'll need to manually update it with the necessary content.`
  const fallbackClpNotCreatedMsg = `No fallback canvas landing page was found, and something went wrong creating it.
    You'll need to create it manually.`

  iD.resultMsgs = processTemplateDir(
    iD.resultMsgs,
    dirs.clps,
    cliOptions.verbose,
  )

  if (!module.meta.containsFallbackClp && module.meta.createdFallbackClp) {
    iD.resultMsgs.failures.push(fallbackClpCreatedMsg)
  } else if (
    !module.meta.containsFallbackClp &&
    !module.meta.createdFallbackClp
  ) {
    iD.resultMsgs.failures.push(fallbackClpNotCreatedMsg)
  }

  files.clps.forEach((clp) => {
    processHeading(iD.resultMsgs, clp)
  })

  return iD.resultMsgs
}

export { process }
