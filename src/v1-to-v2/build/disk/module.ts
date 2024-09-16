// node
import util from "node:util"
import { exec } from "node:child_process"

// types
import { Data, Meta } from "../../types.js"

// data setup
const execAsync = util.promisify(exec)

// do the thing
async function build(iD: Data): Promise<Meta> {
  iD.module.meta.createdConfigJson = await createConfig(iD)
  iD.module.meta.createdFallbackClp = checkForCreatedFallbackClp(iD)

  return iD.module.meta
}

async function createConfig(iD: Data): Promise<boolean> {
  if (!iD.env.isPklInstalled) return false

  try {
    const { stdout, stderr } = await execAsync(
      "pkl eval -f json ./internal-resources/data/config.pkl -o %{moduleDir}/%{moduleName}.%{outputFormat}",
    )
    if (stderr) throw new Error(stderr)
    return true
  } catch (error) {
    return false
  }
}

function checkForCreatedFallbackClp(iD: Data): boolean {
  const fallbackClp = iD.files.clps.find(
    (clp) => clp.desiredPath === "./canvas-landing-pages/fallback.md",
  )

  if (fallbackClp && !iD.module.meta.containsFallbackClp) {
    return fallbackClp.didMoveOrCreate
  }
  return false
}

export { build }
