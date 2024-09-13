async function getData(iD) {
    if (!iD.files.rootReadme.isFound) {
        return iD.files;
    }
    const splitRootReadme = iD.files.rootReadme.curFileContent.split("\n");
    const mlsWithLineNums = iD.files.mls
        .map((ml) => getMlData(ml, splitRootReadme))
        .filter((ml) => ml.lineNum !== 0);
    const lvlUpMlsWithLineNums = iD.files.lvlUpMls
        .map((ml) => getMlData(ml, splitRootReadme))
        .filter((ml) => ml.lineNum !== 0);
    const allMlsWithLineNums = [...mlsWithLineNums, ...lvlUpMlsWithLineNums];
    if (allMlsWithLineNums.length === 0)
        return iD.files;
    allMlsWithLineNums.sort((a, b) => a.lineNum - b.lineNum);
    allMlsWithLineNums.forEach((mlWithLineNum, index) => {
        const correctedIdx = index + 1;
        if (mlWithLineNum.isLvlUp) {
            const idx = iD.files.lvlUpMls.findIndex((ml) => (ml.id === mlWithLineNum.id));
            iD.files.lvlUpMls[idx].deliveryOrder = correctedIdx;
        }
        else {
            const idx = iD.files.mls.findIndex((ml) => ml.id === mlWithLineNum.id);
            iD.files.mls[idx].deliveryOrder = correctedIdx;
        }
    });
    return iD.files;
}
function getMlData(ml, splitRootReadme) {
    const mlReadmeLine = splitRootReadme.findIndex((line) => line.includes(ml.curPath));
    return {
        id: ml.id,
        isLvlUp: ml.isLvlUp,
        lineNum: mlReadmeLine,
    };
}
export { getData };
