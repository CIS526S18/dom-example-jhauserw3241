"use strict";

// PORT definition
const PORT = 3000;

// Import the HTTP library
const http = require('http');

// Import the fs library (to get the file system)
const fs = require('fs');

/** @function replaceAll
 * Replaces all instances of a substring in a string
 * @param {string} str - a string
 * @param {string} find - a substring to find
 * @param {string} replace - the string to replace the substring with
 * @returns {string} - the updated string
 */
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/** @function serveIndex
 * Serves the list of files in the specified directory
 * @param {string} path - the directory to find a list of files for
 * @param {http.serverReponse} res - the http response object
 */
function serveIndex(path, res) {
    var newPath = replaceAll(path, 'public/', '');
    fs.readdir(path, function(err, files) {
        if(err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Server Error");
        }

        var html = "<p>Index of " + path + "</p>";
        html += "<ul>";
        html += files.map(function(item) {
            return "<li><a href='" + newPath + item + "'>" + item + "</a></li>";
        }).join("");
        html += "</ul>";
        res.end(html);
    })
}

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
    var path = 'public' + req.url
    fs.exists(path, function(exists) {
        if(exists) {
            fs.stat(path, function(err, stats) {
                if (stats.isDirectory()) {
                    serveIndex(path + '/', res);
                } else if (stats.isFile()) {
                    serveFile(path, res);
                } else {
                    res.statusCode = 404;
                    res.end("File Not Found");
                }
            });
        } else {
            res.statusCode = 404;
            res.end("File Not Found");
        }
    });
}

// Create the web server
var server = http.createServer(handleRequest);

// Start listening on port PORT
server.listen(PORT, function() {
    console.log("Listening on port " + PORT);
});