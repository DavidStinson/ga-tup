// npm
import { select, confirm, input } from "@inquirer/prompts"
import { titleCase } from "title-case"

// local
import { getMlNamesForConsole } from "../helpers.js"
import { promptContinue } from "../helpers.js"

// types
import { Data, Module, MlFile, LvlUpMlDir } from "../../types.js"

// do the thing
async function prompt(iD: Data): Promise<Data> {
  await promptContinue("Continue with the update?")
  iD.module = await modulePrefixCollect(iD.module)
  iD.module = await verifyAndCollectHeadline(iD.module)
  iD.module = await verifyAndCollectGhRepoName(iD.module)
  
  iD.files.mls = await verifyAndCollectMlTitles(iD.files.mls, false)
  iD.module.meta.isMigratingLvlUp = await checkLevelUpMigrating(
    iD.dirs.lvlUpMls
  )
  if (!iD.module.meta.isMigratingLvlUp) {
    iD.dirs.lvlUpMls = await toggleOffCreate(iD.dirs.lvlUpMls)
  }

  if (iD.module.meta.type === "lecture") {
    iD.files.lvlUpMls = await verifyAndCollectMlTitles(iD.files.lvlUpMls, true)
  }

  iD = await confirmSelections(iD)
  return iD
}

async function modulePrefixCollect(module: Module): Promise<Module> {
  const msg = module.prefix
    ? `You've specified this prefix:

    ${module.prefix}

  This is the name that will be used as the prefix throughout the module.
  Do you want to change it?`
    : `Auto-detected the module name as:

    ${module.dirNameTitleCase}

  This is the name that will be used as the headline name throughout the module.
  Some of this headline name may be part of the module prefix name instead.
  Would you like to continue without specifying a prefix?`

  try {
    if (await confirm({ message: msg })) return module

    const userInput = await input({
      message: "What is the prefix?",
      default: module.prefix,
    })

    module.prefix = userInput.trim()

    return module
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function verifyAndCollectHeadline(module: Module): Promise<Module> {
  return await verifyHeadline(module) ? module : await collectHeadline(module)
}

async function verifyHeadline(module: Module): Promise<boolean> {
  const msg = module.meta.customHeadline
    ? `You previously identified the module headline as:
    
    ${module.headline}

  This is the name that will be used as the headline throughout the module.
  Verify that this is the exact name you wish to use. Take note of:
   - Capitalization (particularly method names or proper nouns)
   - Punctuation (including dashes)
  
  Is this the correct headline?`
    : `Auto-detected the module name as:

    ${module.dirNameTitleCase}

  This is the name that will be used as the headline throughout the module.
  Verify that this is the exact name you wish to use. Take note of:
   - Capitalization (particularly method names or proper nouns)
   - Punctuation (including dashes)
  ${
    module.prefix
      ? `
    It looks like you specified a prefix, meaning this is likely not the 
    correct headline.
`
      : ``
  }
  Is this the correct headline?`

  try {
    return await confirm({ message: msg })
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function collectHeadline(module: Module): Promise<Module> {
  try {
    const userInput = await input({
      message: "What is the correct name?",
      default: module.headline ? module.headline : module.dirNameTitleCase,
      required: true,
    })

    module.headline = userInput.trim()
    module.meta.customHeadline = module.dirNameTitleCase !== module.headline

    return module
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function verifyAndCollectGhRepoName(module: Module): Promise<Module> {
  module.dirName = await verifyGhRepoName(module) 
    ? module.dirName 
    : await collectGhRepoName(module)
  return module
}

async function verifyGhRepoName(module: Module): Promise<boolean> {
  const msg = `Auto-detected the GitHub repository name as:

    ${module.dirName}

  It is extremely important that this matches the name of this repository on GitHub exactly.
  Is this the exact name of this module as it appears on GitHub?`

  try {
    return await confirm({ message: msg })
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function collectGhRepoName(module: Module): Promise<string> {
  try {
    const userInput = await input({
      message: "What is the correct name?",
      default: module.dirName,
      required: true,
    })

    return userInput.trim()
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function verifyAndCollectMlTitles(
  mls: MlFile[], isLevelUp: boolean = false
): Promise<MlFile[]> {
  const mlsThatExist = mls.filter(ml => ml.isFound)
  const verifiedMls = await verifyMlTitles(mlsThatExist, isLevelUp) 
    ? mlsThatExist 
    : await collectMlTitles(mlsThatExist)
  return mls.map(ml => verifiedMls.find(vm => vm.id === ml.id) || ml)
}

async function verifyMlTitles(
  mls: MlFile[], isLevelUp: boolean = false
): Promise<boolean> {
  if (!mls.length) return true
  const mlNames = getMlNamesForConsole(mls)

  const msg = `Auto-detected the${isLevelUp ? " Level Up " : " "}microlesson names as:
      
    ${mlNames}

  These are the names that will be used to refer to these microlessons
  throughout the module.
  Verify that these are the exact names you wish to use. Take note of:
   - Capitalization (particularly method names or proper nouns)
   - Punctuation (including dashes)
  ${!isLevelUp 
    ?`
  If you think a microlesson is missing, ensure that the microlesson's directory
  contains a README.md file.
`
    : ``
  }
  Are these names all correct?`

  try {
    return await confirm({ message: msg })
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function collectMlTitles(mls: MlFile[]): Promise<MlFile[]> {
  interface Choices {
    value: MlFile | boolean
    name: string
  }
  try {
    while (true) {
      const choices: Choices[] = mls.map((ml) => ({
        value: ml,
        name: ml.displayName,
      }))

      choices.unshift({ value: false, name: "I'm done editing!" })

      const editingMl = await select({
        message: "Select a microlesson name to edit:",
        choices: choices,
      })

      if (typeof editingMl === "boolean") break

      const selectedMlIdx = mls.findIndex(
        (ml) => ml.id === editingMl.id
      )

      const userInput = await input({
        message: "What is the correct name?",
        default: editingMl.displayName,
        required: true,
      })

      mls[selectedMlIdx].displayName = userInput.trim()

      mls[selectedMlIdx].titleCaseName = mls[selectedMlIdx].displayName
    }

    return mls
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function checkLevelUpMigrating(mls: LvlUpMlDir[]): Promise<boolean> {
  if (!mls.length) return false

  const existingDirs = mls.filter(dir => !dir.canCreate)
  if (mls.length === existingDirs.length) return false 

  const msg = `Some or all of the existing Level Up microlessons in the ./level-up directory
  can be migrated into their own directories in the root of the module automatically.
  Would you like to do this?`
  try {
    return await confirm({ message: msg })
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function toggleOffCreate(dirs: LvlUpMlDir[]) {
  return dirs.map((dir) => ({ ...dir, shouldCreate: false }))
}

async function confirmSelections(iD: Data): Promise<Data> {
  const { files, dirs, module } = iD
  const mlsThatExist = files.mls.filter(ml => ml.isFound)
  const mlNames = getMlNamesForConsole(mlsThatExist)

  const msg = `Please review the following:
  
  Module type:
    ${titleCase(module.meta.type)}

  Module GitHub repository name:
    ${module.dirName}
  
  Full module title:
    ${
      module.prefix
        ? `${module.prefix} - ${module.headline}`
        : module.headline
    }
  ${module.prefix
      ? `
  Module Prefix:
    ${module.prefix}
`
      : ``
  }
  Module Headline:
    ${module.headline}

  Module Microlessons:
    ${mlNames}

  ${levelUpMlDisplay(files.lvlUpMls, dirs.lvlUpMls, module)}

  Is all of this correct?`

  try {
    if (await confirm({ message: msg })) return iD

    return prompt(iD)
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

function levelUpMlDisplay(
  files: MlFile[], dirs: LvlUpMlDir[], module: Module
): string {
  const notLectureMsg = `This is not a lecture module, so no Level Up microlessons need to be migrated.`
  if (module.meta.type !== "lecture") return notLectureMsg

  const noLevelUpMlsMsg = `There are no Level Up microlessons to migrate.`
  if (!dirs.length) return noLevelUpMlsMsg

  const optNoLevelUpMigrateMsg = "You have decided not to migrate the Level Up microlessons."
  if (!module.meta.isMigratingLvlUp) return optNoLevelUpMigrateMsg

  const allLevelUpMlsOverlapMsg = `No Level Up microlessons can be migrated because the existing Level Up
  microlessons in the ./level-up directory all have overlapping names with
  directories already present in the root of the module.`

  const dirsWithoutOverlap = dirs.filter(dir => dir.canCreate)
  if (!dirsWithoutOverlap.length) return allLevelUpMlsOverlapMsg

  const mlsToMigrate = files.filter(file => (
    dirsWithoutOverlap.some(dir => dir.dirName === file.fileName)
  ))

  const levelUpMlNames = getMlNamesForConsole(mlsToMigrate)
  
  const someLevelUpMlsOverlapMsg = `Some, but not all Level Up microlessons can be migrated. They're shown below:
    ${levelUpMlNames}`
  const noLevelUpMlsOverlapMsg = `All Level Up microlessons can be migrated. They're shown below:
    ${levelUpMlNames}`

  if (mlsToMigrate.length < files.length) {
    return someLevelUpMlsOverlapMsg
  } else {
    return noLevelUpMlsOverlapMsg
  }
}

export { prompt }
