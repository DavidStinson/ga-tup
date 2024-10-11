// workers
import {
  buildPage,
  scrape,
  writePdfs,
  killBrowser,
} from "./playwright/index.js"

// do the thing
async function exportCourseAsPdf(url: string): Promise<void> {
  const page = await buildPage(url)
  const scrapedPdfs = await scrape(page)
  await writePdfs(scrapedPdfs)
  await killBrowser()
}

export { exportCourseAsPdf }
