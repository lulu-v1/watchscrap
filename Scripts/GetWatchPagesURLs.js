const dbHandler = require("../DbManagement/MainDbManagement/DbHandler");

// Function to get URLs of watch pages WITHOUT DUPLICATES HEHEEHEHE
async function getWatchPagesURLs(page) {
    try {
        await page.waitForSelector("#wt-watches .js-article-item.article-item.block-item.rcard", { visible: true });
    }catch (e) {
        return
    }
    const urls = await page.$$eval('#wt-watches .js-article-item.article-item.block-item.rcard', anchors =>
        anchors.map(a => a.href)
    );

    const uniqueUrls = await Promise.all(
        urls.map(async url => {
            const exists = await dbHandler.checkIfLinkExists(url);
            if (!exists && url.includes("/rolex/")) {
                return url;
            }
        })
    );
    return uniqueUrls.filter(url => url !== null);
}

// Export the function for external usage
module.exports = getWatchPagesURLs;
