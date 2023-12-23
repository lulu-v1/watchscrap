// Import the HTTP module
const http = require("http");
// Import the URL module
const url = require("url");
const retrieveAllWatches = require("../Api/RetrieveInfos.js");
// Make our HTTP server
const server = http.createServer((req, res) => {
    // Set our header
    res.setHeader("Access-Control-Allow-Origin", "*")
    // Parse the request url
    const parsed = url.parse(req.url, true)
    // Get the path from the parsed URL
    const reqUrl = parsed.pathname
    // Compare our request method
    if (req.method === "GET") {
        if (reqUrl === "/") {
            res.write(retrieveAllWatches())
            res.end()
        }
    } else {
            res.write("Wrong request method")
            res.end()
        }
})
// Have the server listen on port 9000
server.listen(9000)
