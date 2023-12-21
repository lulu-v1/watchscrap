async function goToPage(page, url) {
  await page.goto(url);
}

async function getInfos(page, selector) {
    return await page.evaluate(selector => {
        return document.querySelector(selector).innerText;
    }, selector);
}