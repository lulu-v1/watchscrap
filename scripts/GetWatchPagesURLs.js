const dbHandler = require("../DbManagement/MainDbManagement/DbHandler");

// Function to get URLs of watch pages WITHOUT DUPLICATES HEHEEHEHE
async function getWatchPagesURLs(page) {
    await page.waitForSelector("#wt-watches .js-article-item.article-item.block-item.rcard", { visible: true });
    const urls = await page.$$eval('#wt-watches .js-article-item.article-item.block-item.rcard', anchors =>
        anchors.map(a => a.href)
    );

    const uniqueUrls = await Promise.all(
        urls.map(async url => {
            const exists = await dbHandler.checkIfKeyExists(url);
            if (exists) {
                console.log(`Key '${url}' exists in the database.`);
                return null; // Returning null for URLs that exist in the database
            } else {
                console.log(`Key '${url}' does not exist in the database.`);
                return url.includes("/rolex/") ? url : null; // Returning URLs that contain "/rolex/"
            }
        })
    );

    return uniqueUrls.filter(url => url !== null);
}


// Export the function for external usage
module.exports = getWatchPagesURLs;
