// types
import type { Module } from "../../types.js"

// do the thing
function updatePrefixAndHeadline(file: string, module: Module) {
  const fileWithPrefix = updatePrefix(file, module)
  const fileWithUpdatedHeadline = updateHeadline(fileWithPrefix, module)
  return fileWithUpdatedHeadline
}

function updatePrefix(file: string, module: Module) {
  return file.replace(
    '<span class="prefix"></span>',
    `<span class="prefix">${module.prefix}</span>`,
  )
}

function updateHeadline(file: string, module: Module) {
  return file.replace(
    '<span class="headline">[tktk Module Name]</span>',
    `<span class="headline">${module.headline}</span>`,
  )
}

function buildLandingHeading(module: Module) {
  return `<h1>
  <span class="prefix">${module.prefix}</span>
  <span class="headline">${module.headline}</span>
</h1>`
}

function buildSubHeading(module: Module, mlName: string) {
  return `<h1>
  <span class="headline">${module.headline}</span>
  <span class="subhead">${mlName}</span>
</h1>`
}

function removeHero(file: string) {
  const idx = file.indexOf(".png)")
  return file.slice(idx + 5)
}

export {
  updatePrefixAndHeadline,
  updateHeadline,
  buildLandingHeading,
  buildSubHeading,
  removeHero,
}
