// npm
import playwright from "playwright"

// do the thing
async function buildPage(url: string): Promise<playwright.Page> {
  const browser = await playwright.chromium.launch()

  const page = await browser.newPage()

  page.on("requestfailed", function (request): void {
    if (request.resourceType() !== "document") return
    console.log(
      `Request to ${request.url()} failed. Reason: ${request.failure()?.errorText}`
    )
  })

  page.on("requestfinished", async function (request): Promise<void> {
    if (request.resourceType() !== "document") return
    
    const res = await request.response()
    if (!res) {
      console.log(`No response was received from ${request.url()}`)
      return
    }
    if (!res.ok()) {
      console.log(
        `Error: There was a ${res.status()} response from the server while requesting ${request.url()}.`
      )
      return
    }

    console.log(
      `Navigated to ${request.url()}. Status code: ${res.status()}.`
    )
    
  })

  await page.goto(url)

  return page
}

export { buildPage }
