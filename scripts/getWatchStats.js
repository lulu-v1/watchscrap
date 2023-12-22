


async function getWatchStats(page) {

    await page.waitForSelector(".js-details-and-security-tabs");
    return await page.$eval('.js-details-and-security-tabs', (element) => {
        const watchStats = Array.from(element.querySelectorAll('tr')).map(a => a.innerText);
        function createWatchObject(data) {
            const watch = {};
            let currentCategory = '';

            data.forEach(item => {
                const [key, ...values] = item.split('\t');
                watch[key] = values.join(' ');
            });

            return watch;
        }
        // Inside the $eval, use evaluate to access the DOM element and return the result
        return watchStats;
    });
}

module.exports = getWatchStats;