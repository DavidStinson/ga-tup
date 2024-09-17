// local
import { promptContinue } from "../helpers.js"

// npm
import { select } from "@inquirer/prompts"

// types
import type { Data, Meta } from "../../types.js"

// do the thing
async function prompt(iD: Data): Promise<Data> {
  await promptContinue("Continue with the update?")
  while (iD.module.meta.type === "") {
    iD.module.meta = await moduleTypeCollect(iD.module.meta)
  }
  return iD
}

async function moduleTypeCollect(meta: Meta): Promise<Meta> {
  try {
    const type = await select<"lecture" | "lab">({
      message: "What kind of module is this?",
      default: "lecture",
      // The value is what is returned from a choice. This matches a key name on
      // each item we'll get a template file for.
      choices: [
        {
          name: "Lecture",
          value: "lecture",
        },
        {
          name: "Lab",
          value: "lab",
        },
      ],
    })
    meta.type = type
    meta.typeUrl = type === "lecture" ? "lectureTemplateUrl" : "labTemplateUrl"
    return meta
  } catch (error) {
    // Not logging anything more here because this is called only if the user
    // quits the program.
    console.log("Exiting...")
    process.exit(0)
  }
}

export { prompt }
