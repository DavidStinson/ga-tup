// local
import { promptContinue } from "../helpers.js"

// npm
import { select } from "@inquirer/prompts"

// types
import { Data } from "../../types.js"

// do the thing
async function prompt(iD: Data): Promise<Data> {
  await promptContinue("Continue with the update?")
  iD.module.type = await moduleTypeCollect()
  return iD
}

async function moduleTypeCollect(): Promise<
  "lectureTemplateUrl" | "labTemplateUrl"
> {
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
    })
  } catch (error) {
    process.exit(0)
  }
}

export { prompt }
