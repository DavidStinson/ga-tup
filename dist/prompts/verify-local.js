// npm
import { select, confirm, input } from "@inquirer/prompts";
// local
import { getMlNamesForConsole } from "../helpers/index.js";
import { promptContinue } from "./index.js";
// do the thing
async function verifyData(iD) {
    await promptContinue("Continue with the update?");
    iD.module.type = await moduleTypeCollect();
    iD.module = await modulePrefixCollect(iD.module);
    iD.module = await verifyAndCollectHeadline(iD.module);
    iD.dirs.microlessons = await verifyAndCollectMlTitles(iD.dirs.microlessons);
    iD = await confirmSelections(iD);
    return iD;
}
async function moduleTypeCollect() {
    try {
        return await select({
            message: "What kind of module is this?",
            // The value is what is returned from a choice. This matches a key name on
            // each item we'll get a template file for.
            choices: [
                {
                    name: "Lecture",
                    value: "lectureTemplateUrl",
                },
                {
                    name: "Lab",
                    value: "labTemplateUrl",
                },
            ],
        });
    }
    catch (error) {
        process.exit(0);
    }
}
async function verifyAndCollectHeadline(module) {
    return (await verifyHeadline(module)) ? module : await collectHeadline(module);
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
            ? "It looks like you specified a prefix, meaning this is likely not the correct headline."
            : ""}

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
async function verifyAndCollectMlTitles(mls) {
    return (await verifyMlTitles(mls)) ? mls : await collectMlTitles(mls);
}
async function verifyMlTitles(mls) {
    const mlNames = getMlNamesForConsole(mls);
    const msg = `Auto-detected the microlesson names as:
      
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
            const selectedMlIdx = mls.findIndex((ml) => (ml.dirName === editingMl.dirName));
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

  Module Prefix:
  ${iD.module.prefix}

  Module Headline:
  ${iD.module.headline}

  Module Microlessons:
  ${mlNames}
  Is all of this correct?`;
    if (await confirm({ message: msg }))
        return iD;
    return verifyData(iD);
}
export { verifyData };
