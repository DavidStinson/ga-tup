// npm
import { select, confirm, input } from "@inquirer/prompts";
// local
import { getMlNamesForConsole } from "../helpers.js";
import { promptContinue } from "../helpers.js";
// do the thing
async function prompt(iD) {
    await promptContinue("Continue with the update?");
    iD.module = await modulePrefixCollect(iD.module);
    iD.module = await verifyAndCollectHeadline(iD.module);
    console.log(iD.module);
    iD.dirs.microlessons = await verifyAndCollectMlTitles(iD.dirs.microlessons, false);
    iD.module.isMigratingLevelUp = await checkLevelUpMigrating(iD.dirs.levelUpMicrolessons);
    if (iD.module.isMigratingLevelUp) {
        iD.dirs.levelUpMicrolessons = await verifyAndCollectMlTitles(iD.dirs.levelUpMicrolessons, true);
    }
    iD = await confirmSelections(iD);
    return iD;
}
async function verifyAndCollectHeadline(module) {
    return await verifyHeadline(module) ? module : await collectHeadline(module);
}
async function verifyHeadline(module) {
    const msg = module.customHeadline
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
  ${module.prefix
            ? `
    It looks like you specified a prefix, meaning this is likely not the 
    correct headline.
`
            : ``}
  Is this the correct headline?`;
    try {
        return await confirm({ message: msg });
    }
    catch (error) {
        process.exit(0);
    }
}
async function collectHeadline(module) {
    try {
        const userInput = await input({
            message: "What is the correct name?",
            default: module.headline ? module.headline : module.dirNameTitleCase,
            required: true,
        });
        module.customHeadline = module.dirNameTitleCase === userInput;
        module.headline = userInput;
        return module;
    }
    catch (error) {
        process.exit(0);
    }
}
async function verifyAndCollectMlTitles(mls, isLevelUp = false) {
    return await verifyMlTitles(mls, isLevelUp) ? mls : await collectMlTitles(mls);
}
async function verifyMlTitles(mls, isLevelUp = false) {
    const mlNames = getMlNamesForConsole(mls);
    const msg = `Auto-detected the${isLevelUp ? " Level Up " : " "}microlesson names as:
      
  ${mlNames}

  These are the names that will be used to refer to these microlessons
  throughout the module.
  Verify that these are the exact names you wish to use. Take note of:
   - Capitalization (particularly method names or proper nouns)
   - Punctuation (including dashes)

  Are these names all correct?`;
    try {
        return await confirm({ message: msg });
    }
    catch (error) {
        process.exit(0);
    }
}
async function collectMlTitles(mls) {
    try {
        while (true) {
            const choices = mls.map((ml) => ({
                value: ml,
                name: ml.dirNameTitleCase,
            }));
            choices.unshift({ value: false, name: "I'm done editing!" });
            const editingMl = await select({
                message: "Select a microlesson name to edit:",
                choices: choices,
            });
            if (typeof editingMl === "boolean")
                break;
            const selectedMlIdx = mls.findIndex((ml) => ml.dirName === editingMl.dirName);
            mls[selectedMlIdx].dirNameTitleCase = await input({
                message: "What is the correct name?",
                default: editingMl.dirNameTitleCase,
                required: true,
            });
        }
        return mls;
    }
    catch (error) {
        process.exit(0);
    }
}
async function checkLevelUpMigrating(mls) {
    if (!mls.length)
        return false;
    const existingDirs = mls.filter(dir => dir.isFound);
    if (mls.length === existingDirs.length)
        return false;
    const msg = `Some or all of the existing Level Up microlessons in the ./level-up directory
  can be migrated into their own directories in the root of the module automatically.
  Would you like to do this?`;
    try {
        return await confirm({ message: msg });
    }
    catch (error) {
        process.exit(0);
    }
}
async function modulePrefixCollect(module) {
    const msg = module.prefix
        ? `You've specified this prefix:

  ${module.prefix}

  This is the name that will be used as the prefix throughout the module.
  Do you want to change it?`
        : `Auto-detected the module name as:

  ${module.dirNameTitleCase}

  This is the name that will be used as the headline name throughout the module.
  Some of this headline name may be part of the module prefix name instead.
  Would you like to specify a prefix to be used throughout the module?`;
    try {
        if (!(await confirm({ message: msg })))
            return module;
        module.prefix = await input({
            message: "What is the prefix?",
            default: module.prefix,
        });
        return module;
    }
    catch (error) {
        process.exit(0);
    }
}
async function confirmSelections(iD) {
    const mlNames = getMlNamesForConsole(iD.dirs.microlessons);
    const msg = `Please review the following:
  
  Module type:
  ${iD.module.type === "lectureTemplateUrl" ? "Lecture" : "Lab"}
  
  Full module title:
  ${iD.module.prefix
        ? `${iD.module.prefix} - ${iD.module.headline}`
        : iD.module.headline}
  ${iD.module.prefix
        ? `
  Module Prefix:
  ${iD.module.prefix}
`
        : ``}
  Module Headline:
  ${iD.module.headline}

  Module Microlessons:
  ${mlNames}

  ${levelUpMlDisplay(iD.dirs.levelUpMicrolessons, iD.module)}

  Is all of this correct?`;
    if (await confirm({ message: msg }))
        return iD;
    return prompt(iD);
}
function levelUpMlDisplay(dirs, module) {
    const noLevelUpMlsMsg = `There are no Level Up microlessons to migrate.`;
    if (!dirs.length)
        return noLevelUpMlsMsg;
    const allLevelUpMlsOverlapMsg = `No Level Up microlessons can be migrated because the existing Level Up
  microlessons in the ./level-up directory all have overlapping names with
  directories already present in the root of the module.`;
    const mlsToMigrate = dirs.filter(dir => !dir.isFound);
    if (!mlsToMigrate.length)
        return allLevelUpMlsOverlapMsg;
    const levelUpMlNames = getMlNamesForConsole(mlsToMigrate);
    const someLevelUpMlsOverlapMsg = `Some, but not all, Level Up microlessons can be migrated. They're shown below:

  ${levelUpMlNames}`;
    const noLevelUpMlsOverlapMsg = `All Level Up microlessons can be migrated. They're shown below:

  ${levelUpMlNames}`;
    if (mlsToMigrate.length < dirs.length) {
        return someLevelUpMlsOverlapMsg;
    }
    else {
        return noLevelUpMlsOverlapMsg;
    }
}
export { prompt };
