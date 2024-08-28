// types
import { LocalMsgs, Dir, File, Assets } from "../types.js"

// do the thing
function checkCanvasLandingPages(msgs: LocalMsgs, files: File[]): LocalMsgs {
  const fallbackPage = files.find(file => (
    file.path === "./canvas-landing-pages/fallback.md"
  ))
  if (!files.length) {
    msgs.warnings.push("No Canvas landing pages were found - a fallback will be created.")
    return msgs
  }
  if (!fallbackPage) {
    msgs.warnings.push(
      "No fallback canvas landing page was found - it will be created"
    )
  }
  files.forEach(file => {
    msgs = check(msgs, file)
    msgs = checkFileWithHeaders(msgs, file)
  })

  return msgs
}

function checkMicrolessons(msgs: LocalMsgs, microlessons: File[]): LocalMsgs {
  if (microlessons.length) {
    msgs.successes.push(`There are ${microlessons.length} microlessons`)
  } else {
    msgs.warnings.push("No microlessons were found")
  }
  
  microlessons.forEach(ml => {
    msgs = check(msgs, ml)
    msgs = checkFileWithHeaders(msgs, ml)
  })

  return msgs
}

function checkAssets(msgs: LocalMsgs, assets: Assets): LocalMsgs {
  const totalAssets = assets.rootAssets.length + assets.microlessonAssets.length + assets.miscAssets.length
  msgs.warnings.push(
    `${totalAssets} legacy hero assets will be deleted - any pages that cannot be automatically updated with new banners must be updated manually`
  )

  return msgs
}

function check(msgs: LocalMsgs, item: Dir | File): LocalMsgs {
  if (item.isFound) {
    msgs.successes.push(`The ${item.path} ${item.type} was found`)
  } else {
    msgs.warnings.push(`The ${item.path} ${item.type} was not found - it will be created`)
  }
  return msgs
}

function checkInverse(msgs: LocalMsgs, item: Dir | File): LocalMsgs {
  if (item.isFound) {
    msgs.failures.push(
      `The ${item.path} ${item.type} was found and will need to be manually migrated`
    )
  } else {
    msgs.successes.push(`No ${item.path} ${item.type} was found`)
  }
  return msgs
}

function checkFileWithHeaders(msgs: LocalMsgs, file: File): LocalMsgs {
  if (file.canUpdateHeader) {
    msgs.successes.push(`The ${file.path} file's headers can be updated`)
  } else {
    msgs.failures.push(`The ${file.path} file's headers cannot be updated automatically and will need to be manually migrated.`)
  }
  return msgs
}

export {
  check,
  checkInverse,
  checkFileWithHeaders,
  checkCanvasLandingPages,
  checkMicrolessons,
  checkAssets
}
