// npm
import chalk from 'chalk';
// data setup
const log = console.log;
const cSuccess = chalk.green;
const cWarn = chalk.yellow;
const cErr = chalk.bold.red;
// do the thing
async function renderRepoAndEnvData(iD) {
    const msgs = mergeMsgArrays(iD.envMsgs, iD.repoMsgs);
    await render(msgs);
}
function mergeMsgArrays(envMsgs, repoMsgs) {
    const msgs = {
        successes: [...envMsgs.successes, ...repoMsgs.successes],
        warnings: [...envMsgs.warnings, ...repoMsgs.warnings],
        failures: [...envMsgs.failures, ...repoMsgs.failures],
    };
    return msgs;
}
async function render(msgs) {
    await displayMessages(msgs);
    if (!msgs.failures.length) {
        log(cSuccess.bold('🚀 Massive success! This module can be updated with minimal manual configuration'));
    }
    else {
        log(cErr('💥 This module has problems that you must manually resolve.'));
    }
}
async function displayMessages(msgs) {
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
export { renderRepoAndEnvData };
