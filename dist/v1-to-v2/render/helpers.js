// npm
import chalk from 'chalk';
// data setup
const log = console.log;
const cSuccess = chalk.green;
const cWarn = chalk.yellow;
const cErr = chalk.bold.red;
// do the thing
async function renderMessages(msgs) {
    if ("unchanged" in msgs) {
        for (const msg of msgs.unchanged) {
            await timer();
            successMessage(msg);
        }
    }
    for (const msg of msgs.successes) {
        await timer();
        successMessage(msg);
    }
    for (const msg of msgs.warnings) {
        await timer();
        warningMessage(msg);
    }
    for (const msg of msgs.failures) {
        await timer();
        failureMessage(msg);
    }
}
async function successMessage(msg) {
    log(cSuccess(`✔ ${msg}`));
}
async function warningMessage(msg) {
    log(cWarn(`⚠️ ${msg}`));
}
async function failureMessage(msg) {
    log(cErr(`❌ ${msg}`));
}
function timer() {
    return new Promise(res => setTimeout(res, 80));
}
export { renderMessages };
