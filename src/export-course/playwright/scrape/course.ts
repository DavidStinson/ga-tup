// npm
import playwright from "playwright"

// config

import { validStudentFacingUrlPrefix } from "../../config.js";

// do the thing
async function scrapeCourse(page: playwright.Page): Promise<string[]> {
  const validStudentFacingUrls: string[] = []
  const allPageLinks = await page.getByRole("link").all()

  for await (const pageLink of allPageLinks) {
    const href = (await pageLink.getAttribute("href"))?.trim()
    
    if (href?.startsWith(validStudentFacingUrlPrefix)) {      
      validStudentFacingUrls.push(href)
    }
  }

  return validStudentFacingUrls  
}

export { scrapeCourse }
