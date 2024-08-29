// npm
import chalk from 'chalk'

// local
import { promptContinue } from "../prompts/index.js";

// do the thing
async function preflight() {
  console.log(chalk.cyan(`Check the following before you begin:
 - Ensure you are in the root directory for a module.
 - Sync your local repo with the most up-to-date version of the material.
 - Switch into a new branch. v2-template-update is a good name for this.
 - Verify the directory name matches the name of the module.
   Incorrect naming won't cause breaking issues, but automatically generated
   values will be incorrect is this is wrong.`
  ));
  await promptContinue("Continue with the update?")
}

export { preflight }
