// types
import type { ResultMsgs, TemplateDir, MlFile, ClpFile } from "../../types.js"

// do the thing
function processTemplateDir(
  msgs: ResultMsgs,
  dir: TemplateDir,
  verbose: boolean,
): ResultMsgs {
  const shouldNotExistMsg = `The ${dir.dirName} directory should not exist at ${dir.curPath}.
    You will need to remove it manually.`
  const shouldNotAndDoesNotExistMsg = `The ${dir.dirName} directory should not exist and it was not found. No action is needed.`
  const foundMsg = `The ${dir.dirName} directory already exists at ${dir.desiredPath}.`
  const optToNotCreateMsg = `You opted to not create the ${dir.dirName} directory at ${dir.desiredPath}.
    You will need to create it manually.`
  const cannotCreateMsg = `The ${dir.dirName} directory could not be created at ${dir.desiredPath}.
    You will need to create it manually.`
  const createdMsg = `Created the ${dir.dirName} directory at ${dir.desiredPath}.`
  const creationErrorMsg = `Something went wrong while creating the ${dir.dirName} directory at ${dir.desiredPath}.
    You will need to create it manually.`

  if (dir.isFound && dir.shouldRemove) {
    msgs.failures.push(shouldNotExistMsg)
  } else if (!dir.isFound && !dir.shouldCreate) {
    msgs.unchanged.push(shouldNotAndDoesNotExistMsg)
  } else if (dir.isFound) {
    if (verbose) msgs.unchanged.push(foundMsg)
  } else if (!dir.shouldCreate && dir.canCreate) {
    msgs.failures.push(optToNotCreateMsg)
  } else if (dir.shouldCreate && !dir.canCreate) {
    msgs.failures.push(cannotCreateMsg)
  } else if (dir.shouldCreate && dir.canCreate && dir.didCreate) {
    msgs.successes.push(createdMsg)
  } else if (!dir.didCreate) {
    msgs.failures.push(creationErrorMsg)
  }

  return msgs
}

function processHeading(msgs: ResultMsgs, file: MlFile | ClpFile) {
  const headingUpdatedMsg = `The heading for the ${file.desiredPath} file was updated.`
  const headingNotUpdatedMsg = `The heading for the ${file.desiredPath} file was not updated.
    You will need to update it manually.`

  if (file.didUpdateHeading) {
    msgs.successes.push(headingUpdatedMsg)
  } else if (!file.didUpdateHeading) {
    msgs.failures.push(headingNotUpdatedMsg)
  }
  return msgs
}

export { processTemplateDir, processHeading }
