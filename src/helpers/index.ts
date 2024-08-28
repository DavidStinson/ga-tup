// node
import os from "node:os"

// types
import { Dir } from "../types.js"

// data setup
interface Dictionary {
  [index: string]: string;
}

const dictionary: Dictionary = {
  Javascript: "JavaScript",
  Github: "GitHub",
}

// do the thing
function fixCommonWords(str: string): string {
  Object.keys(dictionary).forEach((word) => {
    str = str.replaceAll(word, dictionary[word])
  })

  return str
}

function getMlNamesForConsole(mls: Dir[]): string {
  let mlNames = ""
  mls.forEach((ml) => {
    mlNames += `  ${ml.dirNameTitleCase}${os.EOL}`
  })

  return mlNames.trimStart()
}

export { fixCommonWords, getMlNamesForConsole }
