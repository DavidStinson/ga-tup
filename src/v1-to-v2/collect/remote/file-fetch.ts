// npm
import chalk from "chalk"

// types
import { 
  TemplateFile, TemplateFileWithHeading, PureTemplateFile 
} from "../../types.js"

// types
import { ResponseError } from "./index.js"

// do the thing
async function getData<T extends TemplateFile | TemplateFileWithHeading>(
  fileData: T,
  urlType: "lectureTemplateUrl" | "labTemplateUrl"
): Promise<T> {
  try {
    const templateFileData = await fetch(fileData[urlType])

    if (!templateFileData.ok) {
      throw new ResponseError("Bad fetch response.", templateFileData)
    }

    fileData.templateFile = await templateFileData.text()
    fileData.templateFileFetched = true

    return fileData
  } catch (error) {
    if (error instanceof ResponseError && error.res) {
      console.log(
        chalk.red(`An error occurred while fetching a template file.
  File: ${error.res.url}
  Status code: ${error.res.status}
  More details below.`)
      )
      console.dir(error.res, { depth: null })
    } else {
      console.log(chalk.red(error))
    }

    fileData.canMoveOrCreate = false

    return fileData
  }
}

async function getPureData(
  fileData: PureTemplateFile, urlType: "lectureTemplateUrl" | "labTemplateUrl"
) {
  try {
    const templateFileData = await fetch(fileData[urlType])

    if (!templateFileData.ok) {
      throw new ResponseError("Bad fetch response", templateFileData)
    }

    fileData.templateFile = await templateFileData.text()
    fileData.templateFileFetched = true
    
    return fileData
  } catch (error) {
    if (error instanceof ResponseError && error.res) {
      console.log(
        chalk.red(`An error occurred while fetching a template file.
  File: ${error.res.url}
  Status code: ${error.res.status}
  More details below.`)
      )
      console.dir(error.res, { depth: null })
    } else {
      console.log(chalk.red(error))
    }
    return fileData
  }
}

export { getData, getPureData }
