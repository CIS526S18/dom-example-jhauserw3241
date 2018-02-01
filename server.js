"use strict";

// PORT definition
const PORT = 3000;

// Import the HTTP library
const http = require('http');

// Import the fs library (to get the file system)
const fs = require('fs');

/** @function serveFile
 * Serves the specified file with the provided response object
 * @param {string} path - specifies the file path to read
 * @param {http.serverResponse} res - the http response object
 */
function serveFile(path, res) {
    fs.readFile(path, function(err, data) {
        if(err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Server Error: Could not read file");
            return;
        }
        
        res.end(data);
    })
}

/** @function handleRequest
 * Request handler
 * @param {http.ClientRequest} req - the http request object
 * @param {http.ServerResponse} res - the http response object
 */
function handleRequest(req, res) {
    // Map request urls for files
    switch(req.url) {
        case '/':
        case '/openhouse.html':
            serveFile('public/openhouse.html', res);
            break;
        case '/openhouse.css':
            serveFile('public/openhouse.css', res);
            break;
        case '/openhouse.js':
            serveFile('public/openhouse.js', res);
            break;
        default:
            res.statusCode = 404;
            res.end("File Not Found");
    }
}

// Create the web server
var server = http.createServer(handleRequest);

// Start listening on port PORT
server.listen(PORT, function() {
    console.log("Listening on port " + PORT);
});