// types
import { Msgs, Dir, File, Assets } from "../../types.js"

// do the thing
function checkCanvasLandingPages(msgs: Msgs, files: File[]): Msgs {
  const fallbackPage = files.find(
    (file) => file.path === "./canvas-landing-pages/fallback.md"
  )
  if (!files.length) {
    msgs.warnings.push(
      "No Canvas landing pages were found - a fallback will be created."
    )
    return msgs
  }
  if (!fallbackPage) {
    msgs.warnings.push(
      "No fallback canvas landing page was found - it will be created"
    )
  }
  files.forEach((file) => {
    msgs = checkGoodItem(msgs, file)
    msgs = checkFileWithHeaders(msgs, file)
  })

  return msgs
}

function checkMicrolessons(msgs: Msgs, microlessons: File[], isLevelUp: boolean): Msgs {
  if (microlessons.length === 1) {
    msgs.successes.push(
      `There is 1${isLevelUp ? " level up " : " "}microlesson.`
    )
  } else if (microlessons.length > 1) {
    msgs.successes.push(
      `There are ${microlessons.length}${isLevelUp ? " level up " : " "}microlessons.`
    ) 
  } else {
    if (isLevelUp) {
      msgs.successes.push(`No level up microlessons were found.`)
    } else {
      msgs.warnings.push(`No microlessons were found.`)
    }
  }

  microlessons.forEach((ml) => {
    msgs = checkGoodItem(msgs, ml)
    msgs = checkFileWithHeaders(msgs, ml)
  })

  return msgs
}

function checkAssets(msgs: Msgs, assets: Assets): Msgs {
  const totalAssets =
    assets.rootAssets.length +
    assets.microlessonAssets.length +
    assets.miscAssets.length
  msgs.warnings.push(
    `${totalAssets} legacy hero assets will be deleted - any pages that cannot be automatically updated with new banners must be updated manually`
  )

  return msgs
}

function checkGoodItem(msgs: Msgs, item: Dir | File): Msgs {
  if (item.isFound) {
    msgs.successes.push(`The ${item.path} ${item.type} was found`)
  } else {
    msgs.warnings.push(
      `The ${item.path} ${item.type} was not found - it will be created`
    )
  }
  return msgs
}

function checkBadItem(msgs: Msgs, item: Dir | File): Msgs {
  if (item.isFound) {
    msgs.failures.push(
      `The ${item.path} ${item.type} was found and will need to be manually migrated`
    )
  } else {
    msgs.successes.push(`No ${item.path} ${item.type} was found`)
  }
  return msgs
}

function checkFileWithHeaders(msgs: Msgs, file: File): Msgs {
  if (file.canUpdateHeader) {
    msgs.successes.push(`The ${file.path} file's headers can be updated`)
  } else {
    msgs.failures.push(
      `The ${file.path} file's headers cannot be updated automatically and will need to be manually migrated.`
    )
  }
  return msgs
}

function checkLevelUpDirs(msgs: Msgs, dirs: Dir[]): Msgs {
  const existingDirs = dirs.filter(dir => dir.isFound)

  if (existingDirs.length) {
    msgs.failures.push(
      `${existingDirs.length} level up microlessons have overlapping names with 
  existing directories in the root of the module. These level up microlessons 
  will need to be manually migrated.`
    )
  } else {
    msgs.successes.push(
      `No level up microlessons have overlapping names with existing directories.`
    )
  }

  dirs.forEach((dir) => {
    msgs = checkLevelUpDirForOverlap(msgs, dir)
  })

  return msgs
}

function checkLevelUpDirForOverlap(msgs: Msgs, dir: Dir): Msgs {
  // If this dir is found, the user needs to manually migrate that microlesson
  if (dir.isFound) {
    msgs.failures.push(
      `The ${dir.path} directory name matches the name of an existing directory in the root of the module. `
    )
  } else {
    msgs.successes.push(
      `The ${dir.path} directory can be created.`,
      `The ${dir.dirNameTitleCase} level up microlesson can be migrated automatically.`
    )
  }

  return msgs
}

export {
  checkGoodItem,
  checkBadItem,
  checkFileWithHeaders,
  checkCanvasLandingPages,
  checkMicrolessons,
  checkAssets,
  checkLevelUpDirs,
}
