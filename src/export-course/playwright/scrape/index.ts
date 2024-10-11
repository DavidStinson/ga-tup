// npm
import playwright from "playwright"

// local
import { scrapeCourse } from "./course.js"
import { scrapeCurriculum } from "./curriculum.js"

// config
import { validStudentFacingUrlPrefix } from "../../config.js"

// do the thing
async function scrape(page: playwright.Page) {
  const pageUrls = await scrapeCourse(page)
  
  const pageData = pageUrls.map(pageUrl => buildPageData(pageUrl))
  const pageAndSubPageData = await scrapeCurriculum(pageData)
  

}

function buildPageData(pageUrl: string) {
  const endOfPrefixIdx = validStudentFacingUrlPrefix.length
  const endOfTitleIdx = pageUrl.indexOf("/", endOfPrefixIdx)
  const title = pageUrl.slice(endOfPrefixIdx, endOfTitleIdx)
  return {title, pageUrl}
}

export { scrape }
