// npm
import { Command } from "commander"

// local
import { v1ToV2 } from "./v1-to-v2/index.js"

// types
import { cliOptionsSchema, CliOptions } from "./types.js"

// do the thing
async function main() {
  const cL = new Command()

  cL.version("0.1.0", "-v, --version", "Outputs the current version.")
  cL.name("ga-tup")
  cL.description("A template updater for GA's modular technical content.")

  cL.command("update", { isDefault: true })
    .description("Update this repo from version 1 to version 2 of the template")
    .option("--verbose", "Enable verbose output", false)
    .action(async (cliOptions) => {
      const validatedCliOptions = validateCliOptions(cliOptions)
      await v1ToV2(validatedCliOptions)
    })
  cL.parse()
}

function validateCliOptions(cliOptions: any): CliOptions {
  const parsedCliOptions = cliOptionsSchema.parse(cliOptions)
  return parsedCliOptions
}

main()
