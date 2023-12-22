async function getWatchStats(page) {
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');

    console.log("Selector found");
    const linksOfCurrentWatchesOnPage = await page.$eval('div#wt-watches', (element) => {
        // Inside the $eval, use evaluate to access the DOM element and return the result
        return Array.from(element.querySelectorAll('a')).map(a => a.href);
    });
    await console.log(linksOfCurrentWatchesOnPage);
}