// local
import { getData as getModuleData } from "./module.js"
import { getData as getTemplateDirsData } from "./dir/template.js"
import { getData as getTemplateFilesData } from "./file/template.js"
import { getData as getMlDirsData } from "./dir/ml.js"
import { getData as getMlFilesData } from "./file/ml.js"
import { getData as getLvlUpFilesData } from "./file/lvl-up.js"
import { getData as getLvlUpDirsData } from "./dir/lvl-up.js"
import { getData as getMlOrder } from "./file/ml-order.js"
import { getData as getAssetsData } from "./file/assets.js"
import { getData as getClpFilesData } from "./file/clp.js"

// types
import type { Data } from "../../types.js"

// do the thing
async function collect(iD: Data): Promise<Data> {
  iD.module = await getModuleData(iD.module)

  iD.dirs = await getTemplateDirsData(iD)
  iD.files = await getTemplateFilesData(iD)

  iD.dirs = await getMlDirsData(iD.dirs, iD.module)
  iD.files = await getMlFilesData(iD)

  iD.files = await getLvlUpFilesData(iD)
  iD.dirs = await getLvlUpDirsData(iD)

  iD.files = await getMlOrder(iD)

  iD.assets = await getAssetsData(iD)

  iD.files = await getClpFilesData(iD)

  return iD
}

export { collect }
