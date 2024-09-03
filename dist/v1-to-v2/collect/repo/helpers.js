const dictionary = {
    Javascript: "JavaScript",
    Github: "GitHub",
};
// do the thing
function fixCommonWords(str) {
    Object.keys(dictionary).forEach((word) => {
        str = str.replaceAll(word, dictionary[word]);
    });
    return str;
}
export { fixCommonWords };
