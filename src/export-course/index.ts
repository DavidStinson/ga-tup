// workers
import { buildPage, scrape } from "./playwright/index.js"

// do the thing
async function exportCourseAsPdf (url: string): Promise<void> {
  const page = await buildPage(url)
  const scrapedHtml = await scrape(page)


}

export { exportCourseAsPdf }