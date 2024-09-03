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

export { fixCommonWords }
