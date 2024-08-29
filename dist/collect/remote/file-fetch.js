// data setup
class ResponseError extends Error {
    res;
    constructor(message, res) {
        super(message);
        this.res = res;
    }
}
// do the thing
async function getData(fileData, modType) {
    try {
        const templateFileData = await fetch(fileData[modType]);
        if (!templateFileData.ok) {
            throw new ResponseError("Bad fetch response", templateFileData);
        }
        fileData.templateFile = await templateFileData.text();
        return fileData;
    }
    catch (error) {
        if (error instanceof ResponseError && error.res) {
            throw new Error(`An error occurred.
  File: ${error.res.url}
  Status code: ${error.res.status}`);
        }
        else {
            throw new Error(error);
        }
    }
}
async function getPureData(fileData, modType) {
    try {
        const templateFileData = await fetch(fileData[modType]);
        if (!templateFileData.ok) {
            throw new ResponseError("Bad fetch response", templateFileData);
        }
        fileData.templateFile = await templateFileData.text();
        return fileData;
    }
    catch (error) {
        if (error instanceof ResponseError && error.res) {
            throw new Error(`An error occurred.
  File: ${error.res.url}
  Status code: ${error.res.status}`);
        }
        else {
            throw new Error(error);
        }
    }
}
export { getData, getPureData };
