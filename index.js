import puppeteer from 'puppeteer';


(async () => {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.goto('https://chrono24.fr/rolex/index.htm');
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');

    function sleep(number) {
        return new Promise(resolve => setTimeout(resolve, number));
    }
    //click on Model Button
    await sleep(1000)
    await page.waitForSelector('.select-like-button');
    await sleep(1000)
    const button = await page.$$('.select-like-button');
    await button[1].click();
    await page.evaluate(() => {
        const data = document.querySelectorAll('pointer');

        for (let i = 43; i < 100; i++) {
            console.log(data[i])
        }

    })
})();
