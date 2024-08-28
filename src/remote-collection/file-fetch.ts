// types
import { TemplateFile, PureTemplateFile } from "../types.js"

// data setup
class ResponseError extends Error {
  res: Response

  constructor(message: string, res: Response) {
    super(message)
    this.res = res
  }
}

// do the thing
async function getData(
  fileData: TemplateFile, 
  modType: "labTemplateUrl" | "lectureTemplateUrl"
) {
  try {
    const templateFileData = await fetch(fileData[modType])
    
    if (!templateFileData.ok) {
      throw new ResponseError("Bad fetch response", templateFileData)
    }

    fileData.templateFile = await templateFileData.text()

    return fileData
  } catch (error) {
    if (error instanceof ResponseError && error.res) {
      throw new Error(`An error occurred.
  File: ${error.res.url}
  Status code: ${error.res.status}`
      );
    } else {
      throw new Error(error as string)
    }
  }
}

async function getPureData(
  fileData: PureTemplateFile, 
  modType: "labTemplateUrl" | "lectureTemplateUrl"
) {
  try {
    const templateFileData = await fetch(fileData[modType])
    
    if (!templateFileData.ok) {
      throw new ResponseError("Bad fetch response", templateFileData)
    }

    fileData.templateFile = await templateFileData.text()
    return fileData
    
  } catch (error) {
    if (error instanceof ResponseError && error.res) {
      throw new Error(`An error occurred.
  File: ${error.res.url}
  Status code: ${error.res.status}`
      );
    } else {
      throw new Error(error as string)
    }
  }
}

export { getData, getPureData }
