const c = require("../Style/consoleColors.js");
const dbHandler = require("../DbManagement/MainDbManagement/DbHandler")

async function getWatchStats(page) {
    try {
        await page.waitForSelector(".js-details-and-security-tabs", {timeout: 0});
    } catch (error) {
        console.error(c.red + '[-]' + c.reset + ' Wrong Page URL');
        return;
    }

    const watch = await page.$eval('.js-details-and-security-tabs', (element) => {
        const watchStats = Array.from(element.querySelectorAll('tr')).map((row) => row.innerText);
        const watchData = {};

        watchStats.forEach((item) => {
            if (item.includes('\t')) {
                const [key, value] = item.split('\t');
                const formattedKey = key.trim();
                watchData[formattedKey] = value.trim();
            }
        });
        return watchData;
    });
    page.close();
    watch["Lien"] = page.url();
    dbHandler.insertWatch(watch)
}

module.exports = getWatchStats;
