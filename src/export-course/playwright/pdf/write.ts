// types
import type { PageAndPdfData } from "../../types.js";

// node
import { mkdir, writeFile } from "node:fs/promises"

// do the thing
async function writePdfs(pageAndPdfData: PageAndPdfData[]) {
  await mkdir("./export", { recursive: true })
  for await (const pageAndPdf of pageAndPdfData) {
    if (!pageAndPdf.pdf) continue
    await writeFile(`./export/${pageAndPdf.title}.pdf`, pageAndPdf.pdf)
    console.log(`${pageAndPdf.moduleUrl} successfully saved to PDF`);
    if (pageAndPdf.errors) console.log("However, there were errors along the way.");    
  }
}

export { writePdfs }
