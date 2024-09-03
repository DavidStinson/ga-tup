// npm
import { select, confirm, input } from "@inquirer/prompts"
import { titleCase } from "title-case"

// local
import { getMlNamesForConsole } from "../helpers.js"
import { promptContinue } from "../helpers.js"

// types
import { Data, Module, Dir } from "../../types.js"

// do the thing
async function prompt(iD: Data): Promise<Data> {
  await promptContinue("Continue with the update?")
  iD.module = await modulePrefixCollect(iD.module)
  iD.module = await verifyAndCollectHeadline(iD.module)
  
  iD.dirs.microlessons = await verifyAndCollectMlTitles(
    iD.dirs.microlessons, false
  )
  iD.module.meta.isMigratingLevelUp = await checkLevelUpMigrating(
    iD.dirs.levelUpMicrolessons
  )
  if (iD.module.meta.isMigratingLevelUp) {
    iD.dirs.levelUpMicrolessons = await verifyAndCollectMlTitles(
      iD.dirs.levelUpMicrolessons, true
    )
  }  
  iD = await confirmSelections(iD)
  return iD
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

    module.meta.customHeadline = module.dirNameTitleCase === userInput
    module.headline = userInput

    return module
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function verifyAndCollectMlTitles(
  mls: Dir[], isLevelUp: boolean = false
): Promise<Dir[]> {
  return await verifyMlTitles(mls, isLevelUp) ? mls : await collectMlTitles(mls)
}

async function verifyMlTitles(
  mls: Dir[], isLevelUp: boolean = false
): Promise<boolean> {
  const mlNames = getMlNamesForConsole(mls)

  const msg = `Auto-detected the${isLevelUp ? " Level Up " : " "}microlesson names as:
      
  ${mlNames}

  These are the names that will be used to refer to these microlessons
  throughout the module.
  Verify that these are the exact names you wish to use. Take note of:
   - Capitalization (particularly method names or proper nouns)
   - Punctuation (including dashes)

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

async function collectMlTitles(mls: Dir[]): Promise<Dir[]> {
  interface Choices {
    value: Dir | boolean
    name: string
  }

  try {
    while (true) {
      const choices: Choices[] = mls.map((ml) => ({
        value: ml,
        name: ml.dirNameTitleCase,
      }))

      choices.unshift({ value: false, name: "I'm done editing!" })

      const editingMl = await select({
        message: "Select a microlesson name to edit:",
        choices: choices,
      })

      if (typeof editingMl === "boolean") break

      const selectedMlIdx = mls.findIndex(
        (ml) => ml.dirName === editingMl.dirName
      )

      mls[selectedMlIdx].dirNameTitleCase = await input({
        message: "What is the correct name?",
        default: editingMl.dirNameTitleCase,
        required: true,
      })
    }

    return mls
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function checkLevelUpMigrating(mls: Dir[]): Promise<boolean> {
  if (!mls.length) return false

  const existingDirs = mls.filter(dir => dir.isFound)
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

    module.prefix = await input({
      message: "What is the prefix?",
      default: module.prefix,
    })

    return module
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

async function confirmSelections(iD: Data): Promise<Data> {
  const mlNames = getMlNamesForConsole(iD.dirs.microlessons)

  const msg = `Please review the following:
  
  Module type:
  ${titleCase(iD.module.meta.type)}
  
  Full module title:
  ${
    iD.module.prefix
      ? `${iD.module.prefix} - ${iD.module.headline}`
      : iD.module.headline
  }
  ${iD.module.prefix
      ? `
  Module Prefix:
  ${iD.module.prefix}
`
      : ``
  }
  Module Headline:
  ${iD.module.headline}

  Module Microlessons:
  ${mlNames}

  ${levelUpMlDisplay(iD.dirs.levelUpMicrolessons, iD.module)}

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

function levelUpMlDisplay(dirs: Dir[], module: Module): string {
  const optNoLevelUpMigrateMsg = "You have decided not to migrate the Level Up microlessons."

  if (!module.meta.isMigratingLevelUp) return optNoLevelUpMigrateMsg

  const noLevelUpMlsMsg = `There are no Level Up microlessons to migrate.`
  if (!dirs.length) return noLevelUpMlsMsg

  const allLevelUpMlsOverlapMsg = `No Level Up microlessons can be migrated because the existing Level Up
  microlessons in the ./level-up directory all have overlapping names with
  directories already present in the root of the module.`

  const mlsToMigrate = dirs.filter(dir => !dir.isFound)
  if (!mlsToMigrate.length) return allLevelUpMlsOverlapMsg

  const levelUpMlNames = getMlNamesForConsole(mlsToMigrate)

  const someLevelUpMlsOverlapMsg = `Some, but not all, Level Up microlessons can be migrated. They're shown below:

  ${levelUpMlNames}`
  const noLevelUpMlsOverlapMsg = `All Level Up microlessons can be migrated. They're shown below:

  ${levelUpMlNames}`

  if (mlsToMigrate.length < dirs.length) {
    return someLevelUpMlsOverlapMsg
  } else {
    return noLevelUpMlsOverlapMsg
  }
}

export { prompt }
