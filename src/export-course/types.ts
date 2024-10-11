// npm
import playwright from "playwright"

// do the thing
interface PageAndContext {
  page: playwright.Page,
  context: playwright.BrowserContext
}

interface PageData {
  title: string,
  moduleUrl: string,
}

interface PageAndPdfData {
  title: string,
  moduleUrl: string,
  errors: boolean,
  pdf: Buffer | undefined,
}

export type { PageAndContext, PageData, PageAndPdfData }
