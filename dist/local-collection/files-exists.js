// node
import { access, constants } from "fs/promises";
// do the thing
async function getData(paths) {
    const results = await Promise.all(paths.map(async (path) => {
        try {
            await access(path, constants.F_OK);
            return true;
        }
        catch (error) {
            return false;
        }
    }));
    return paths.filter((asset, idx) => results[idx]);
}
export { getData };
