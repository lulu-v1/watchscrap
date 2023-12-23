
// Function to introduce a sleep/delay
function sleep(number) {
    return new Promise(resolve => setTimeout(resolve, number));
}

// Function to get URLs of watch pages
async function getWatchPagesURLs(page) {
    await page.waitForSelector("#wt-watches .js-article-item.article-item.block-item.rcard", { visible: true });
    const urls = await page.$$eval('#wt-watches .js-article-item.article-item.block-item.rcard', anchors =>
        anchors.map(a => a.href)
    );
    return urls.filter(url => url.includes("/rolex/"));
}

// Export the function for external usage
module.exports = getWatchPagesURLs;
