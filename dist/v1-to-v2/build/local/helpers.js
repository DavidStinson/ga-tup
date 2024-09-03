function updatePrefixAndHeadline(file, module) {
    const fileWithPrefix = updatePrefix(file, module);
    const fileWithUpdatedHeadline = updateHeadline(fileWithPrefix, module);
    return fileWithUpdatedHeadline;
}
function updatePrefix(file, module) {
    return file.replace('<span class="prefix"></span>', `<span class="prefix">${module.prefix}</span>`);
}
function updateHeadline(file, module) {
    return file.replace('<span class="headline">[tktk Module Name]</span>', `<span class="headline">${module.headline}</span>`);
}
function buildLandingHeading(module) {
    return `<h1>
  <span class="prefix">${module.prefix}</span>
  <span class="headline">${module.headline}</span>
</h1>`;
}
function buildSubHeading(module, mlName) {
    return `<h1>
  <span class="headline">${module.headline}</span>
  <span class="subhead">${mlName}</span>
</h1>`;
}
function removeHero(file) {
    const idx = file.indexOf(".png)");
    const oIdx = file.indexOf(")");
    console.log(idx + 5, oIdx + 1);
    const noHero = file.slice(idx + 5);
    return noHero;
}
export { updatePrefixAndHeadline, buildLandingHeading, buildSubHeading, removeHero, };
