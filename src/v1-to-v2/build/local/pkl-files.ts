// node
import os from "node:os"

// npm
import { titleCase } from "title-case"

// types
import { Files, Module, PklFile, MlFile } from "../../types.js"

// config
import { config } from "../../config.js"

// do the thing
function build(files: Files, module: Module): Files {
  const validMls = files.mls.filter((ml) => ml.isFound)
  const movingLvlUpMls = files.lvlUpMls.filter(
    (ml) => ml.shouldMove && ml.canMoveOrCreate,
  )
  const allMlsToWrite = [...validMls, ...movingLvlUpMls]

  allMlsToWrite.sort((a, b) => a.deliveryOrder - b.deliveryOrder)

  files.pklConfig = buildPklConfig(files, allMlsToWrite, module)
  files.pklMicrolessons = buildPklMicrolessons(files, allMlsToWrite)
  return files
}

function buildPklConfig(
  files: Files,
  mlsToWrite: MlFile[],
  module: Module,
): PklFile {
  const mls = mlsToWrite.map((ml, idx, arr) => {
    const isLast = idx === arr.length - 1
    return `      mls.${ml.camelCaseName}${!isLast ? os.EOL : ""}`
  })

  const type =
    titleCase(module.meta.type) === "Lecture"
      ? "Lesson"
      : titleCase(module.meta.type)

  const amends = `amends "${config.vars.pklTemplateUrl}"${os.EOL}`

  const repo = `repo {
  // This name is shown in the header nav to navigate users home
  friendlyName = "${
    module.prefix ? `${module.prefix} - ${module.headline}` : module.headline
  }"
  // This must match the repo name as it appears on GitHub exactly
  name = "${module.dirName}"
  type = "${type}"
}
`

  const courses = `courses {
  new {
    name = "fallback"
    microlessons {
      // add microlessons here, in the order they should be delivered
${mls.join("")}
    }
  }
}
`

  files.pklConfig.newFileContent = `${amends}
${files.pklConfig.templateFile}
${repo}
${courses}
`

  return files.pklConfig
}

function buildPklMicrolessons(files: Files, mlsToWrite: MlFile[]): PklFile {
  const mls = mlsToWrite.map(
    (ml) =>
      `${ml.camelCaseName} = new Template.Microlesson {
  friendlyName = "${ml.titleCaseName}"
  dirName = "${ml.kebabName}"
  type = "Content"
  videoUrl = ""
}

`,
  )

  const importTemplate = `import "${config.vars.pklTemplateUrl}" as Template`

  files.pklMicrolessons.newFileContent = `${importTemplate}
${files.pklMicrolessons.templateFile}
${mls.join("")}`

  return files.pklMicrolessons
}

export { build }
