#!/usr/bin/env node

// npm
import { Command } from "commander"

// local
import { v1ToV2 } from "./v1-to-v2/index.js"
import { exportCourseAsPdf } from "./export-course/index.js"

// types
import { updateCliOptionsSchema, exportCliUrlArgument } from "./types.js"
import type { UpdateCliOptions, ExportCLIUrlArgument } from "./types.js"

// do the thing
async function main() {
  const cL = new Command()

  cL.version("0.2.4", "-v, --version", "Outputs the current version.")
  cL.name("ga-tup")
  cL.description("A template updater for GA's modular technical content.")

  cL.command("update", { isDefault: true })
    .description("Update this repo from version 1 to version 2 of the template")
    .option("--verbose", "Enable verbose output", false)
    .action(async (cliOptions) => {
      const validatedCliOptions = validateUpdateCliOptions(cliOptions)
      await v1ToV2(validatedCliOptions)
    })
    cL.command("export-course-as-pdf")
    .argument("<url>", "URL to a course page published to GitHub Pages containing student facing links with content in the Modular Courses Organization on GitHub Enterprise.")
    .description("Export the contents of a course as a collection of PDF documents. The URL to a course page containing student facing links to content must be provided. Exported content will be placed in the current directory.")
    .action(async (url) => {
      const validatedUrl = validateExportArguments(url)
      await exportCourseAsPdf(url)
    })

  // cL.command("export-course-as-html")
  cL.parse()
}

function validateUpdateCliOptions(cliOptions: any): UpdateCliOptions {
  const parsedCliOptions = updateCliOptionsSchema.parse(cliOptions)
  return parsedCliOptions
}

function validateExportArguments(url: any): ExportCLIUrlArgument {
  const parsedUrlArgument = exportCliUrlArgument.parse(url)
  return parsedUrlArgument
}

main()
