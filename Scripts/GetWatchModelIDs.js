import puppeteer from 'puppeteer';

async function getWatchModelsID() {
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();
    await page.goto('https://chrono24.fr/rolex/index.htm');
    await page.waitForSelector('.js-cookie-accept-all');
    await page.click('.js-cookie-accept-all');

    // Click on Model Button
    await page.waitForSelector('.select-like-button');
    const buttons = await page.$$('.select-like-button');
    await buttons[1].click();
    await page.waitForSelector('.filter-inputtype-checkbox.form-check.p-a-3.p-a-sm-0');
    const watchModels = await page.evaluate(() => {
        const dataElements = document.querySelectorAll('.filter-inputtype-checkbox.form-check.p-a-3.p-a-sm-0 > label > input');
        const nameElements = document.querySelectorAll('.filter-inputtype-checkbox.form-check.p-a-3.p-a-sm-0 > label > span');
        const watches = [];
        for (let i = 0; i < dataElements.length; i++) {
            const name = nameElements[i].innerText.replace(/\s\(\d+\)/, '');
            const value = dataElements[i].value.trim();

            watches.push({name, value});
        }
        return watches;
    });
}
export default getWatchModelsID;