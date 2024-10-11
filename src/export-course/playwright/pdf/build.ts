// npm
import memoryStreams from "memory-streams"
import muhammara from "muhammara"

// types
import type { PageAndContext } from "../../types.js"

// do the thing
async function buildPdf(
  moduleWindow: PageAndContext,
  microlessonWindows: PageAndContext[],
): Promise<Buffer | undefined> {
  const pdfs = []
  const options = {
    displayHeaderFooter: false,
    margin: {
      top: ".25in",
      right: ".25in",
      bottom: ".25in",
      left: ".25in",
    },
    printBackground: true,
    format: "Letter",
    scale: .8,
  }
  await moduleWindow.page.emulateMedia({media: "screen"})
  pdfs.push(await moduleWindow.page.pdf(options))
  // await moduleWindow.context.close()
  for await (const microlessonWindow of microlessonWindows) {
    await microlessonWindow.page.emulateMedia({ media: "screen" })
    pdfs.push(await microlessonWindow.page.pdf(options))
    // await microlessonWindow.context.close()
  }
  
  return mergePdfBuffers(pdfs)
}

// This function is a slightly updated version of `merge-pdf-buffers`
// found here: https://github.com/nyel-gh/merge-pdf-buffers
async function mergePdfBuffers(pdfs: Buffer[]) {
  const first = pdfs[0]
  if (!first) return

  const outStream = new memoryStreams.WritableStream();
  const firstPdfStream = new muhammara.PDFRStreamForBuffer(first);

  const pdfWriter = muhammara.createWriterToModify(
    firstPdfStream,
    new muhammara.PDFStreamForResponse(outStream),
  );

  pdfs.shift();
  pdfs.forEach(pdf => {
    const newPdfStream = new muhammara.PDFRStreamForBuffer(pdf);
    pdfWriter.appendPDFPagesFromPDF(newPdfStream);
  });

  pdfWriter.end();
  return outStream.toBuffer();

}

export { buildPdf }
