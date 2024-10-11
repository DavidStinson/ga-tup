// local
import { scrapeValidUrls } from "./pageUrls.js"
import { scrapeModule } from "./module.js"

// config
import { validStudentFacingUrlPrefix } from "../../config.js"

// types
import type { PageAndContext, PageData, PageAndPdfData } from "../../types.js"

// do the thing
async function scrape(window: PageAndContext): Promise<PageAndPdfData[]> {
  const moduleUrls = await scrapeValidUrls(window)
  
  const courseData = moduleUrls.map(moduleUrl => buildCourseData(moduleUrl))
  const ModuleData = await scrapeModule(courseData)
  return ModuleData
}

function buildCourseData(moduleUrl: string): PageData {
  const endOfPrefixIdx = validStudentFacingUrlPrefix.length
  const endOfTitleIdx = moduleUrl.indexOf("/", endOfPrefixIdx)
  const title = moduleUrl.slice(endOfPrefixIdx, endOfTitleIdx)
  return {title, moduleUrl}
}

export { scrape }
