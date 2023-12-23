const puppeteer = require('puppeteer');

// Function to introduce a sleep/delay
function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}

// Function to get URLs of watch pages
async function getWatchPagesURLs(page) {
    // Wait for the specific selector to be visible
    await page.waitForSelector("#wt-watches .js-article-item.article-item.block-item.rcard", { visible: true });

    // Evaluate in the context of the page to get URLs
    const urls = await page.$$eval('#wt-watches .js-article-item.article-item.block-item.rcard', anchors =>
        anchors.map(a => a.href)
    );

    // Filter URLs that contain "/rolex/"
    return urls.filter(url => url.includes("/rolex/"));
}

// Export the function for external usage
module.exports = getWatchPagesURLs;
