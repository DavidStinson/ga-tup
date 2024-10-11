// local
import { buildPage } from "../page/index.js"
import { scrapeValidUrls } from "./pageUrls.js"
import { buildPdf } from "../pdf/build.js"

// types
import type { PageData, PageAndPdfData } from "../../types.js"

// do the thing
async function scrapeModule(pageData: PageData[]): Promise<PageAndPdfData[]> {
  const pageAndPdfData: PageAndPdfData[] = []
  for await (const pageItem of pageData) {
    let errors = false
    console.log(pageItem);
    
    const moduleWindow = await buildPage(pageItem.moduleUrl)

    const microlessonUrls = await scrapeValidUrls(moduleWindow)
    
    const settledMicrolessonWindows = await Promise.allSettled(
      microlessonUrls.map(async (microlessonUrl) => {
        return await buildPage(microlessonUrl)
      }),
    )
    const microlessonWindows = settledMicrolessonWindows.filter(
      (microlessonWindow) => (microlessonWindow.status === "fulfilled") 
    )
    .map(mlW => mlW.value)
    
    if (microlessonWindows.length !== settledMicrolessonWindows.length) {
      console.log(
        `WARNING! The ${pageItem.title} should have ${settledMicrolessonWindows.length} microlessons, but only ${microlessonWindows.length} were found.`
      );
      errors = true
    }
    const pdf = await buildPdf(moduleWindow, microlessonWindows)
    pageAndPdfData.push({
      title: pageItem.title,
      moduleUrl: pageItem.moduleUrl,
      errors,
      pdf
    })
  }

  return pageAndPdfData
}

export { scrapeModule }
