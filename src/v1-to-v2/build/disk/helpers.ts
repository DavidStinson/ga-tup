// node
import { mkdir, writeFile } from "node:fs/promises"

async function writeDirToDisk(desiredPath: string): Promise<boolean> {
  try {
    await mkdir(desiredPath, { recursive: true })
    return true
  } catch (error) {
    return false
  }
}

async function writeFileToDisk(desiredPath: string, content: string): Promise<boolean> {
  try {
    await writeFile(desiredPath, content)
    return true
  } catch (error) {
    return false
  }
}

export { writeDirToDisk, writeFileToDisk }
