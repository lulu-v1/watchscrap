function formatPrice(input) {
    const priceRegex = /(\d{1,3}(?:[\s ]\d{3})*)/g; // Matches groups of digits separated by spaces or ' ' character
    const matches = input.match(priceRegex);

    if (!matches || matches.length < 1) {
        return null;
    }

    // Extract the digits from the matched string and join them together
    return matches[matches.length - 1].replace(/[^\d]/g, '');
}
function processWatch(watch) {
    watch["Prix"] = formatPrice(watch["Prix"]);

    try {
        watch["État"] = watch["État"].split(' (')[0];
    } catch (error) {
        console.log("Error parsing watch state")
    }
    try {
        watch["Diamètre"] = watch["Diamètre"].split(' Essayez')[0];
    } catch (error) {
        console.log("Error parsing watch diameter")
    }
    return watch;
}

module.exports = {processWatch};