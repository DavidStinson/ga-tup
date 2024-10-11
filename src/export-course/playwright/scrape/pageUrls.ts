// config
import { validStudentFacingUrlPrefix } from "../../config.js";

// types
import type { PageAndContext } from "../../types.js";

// do the thing
async function scrapeValidUrls(window: PageAndContext): Promise<string[]> {
  const validStudentFacingUrls: string[] = []
  const allPageLinks = await window.page.getByRole("link").all()

  console.log(allPageLinks);
  

  for await (const pageLink of allPageLinks) {
    let href = (await pageLink.getAttribute("href"))?.trim()
    if (href?.startsWith("/modular-curriculum-all-courses/")) {
      href = `https://pages.git.generalassemb.ly${href}`
    }
    
    
    
    if (href?.startsWith(validStudentFacingUrlPrefix)) {      
      validStudentFacingUrls.push(href)
    }
  }

  // await window.context.close()
  return validStudentFacingUrls  
}

export { scrapeValidUrls }
