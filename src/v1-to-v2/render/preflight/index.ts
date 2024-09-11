// npm
import chalk from 'chalk'

// types
import { Data } from "../../types.js"

// do the thing
async function render(iD: Data) {
  if (iD.cliOptions.verbose) {
    console.log(chalk.magenta("Verbose output enabled. Extra success messages will be shown."))
  }
  console.log(chalk.cyan(`Check the following before you begin:
 - Ensure you are in the root directory for a module.
 - Sync your local repo with the most up-to-date version of the material.
 - Switch into a new branch. v2-template-update is a good name for this.
 - Verify the module's directory name matches the kebab-case name of the module.
   Incorrect naming won't cause breaking issues, but automatically generated
   values will be incorrect if the name is wrong.`
  ));
}

export { render }
