"use strict";

// PORT definition
const PORT = 3000;

// Import the HTTP library
const http = require('http');

// Import the fs library (to get the file system)
const fs = require('fs');
const path = require('path');

const ROOT_DIR = "public";

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
 * @param {string} virtualPath - specifies the path to find the file at without the base directory
 * @param {http.serverReponse} res - the http response object
 */
function serveIndex(virtualPath, res) {
    var filePath = path.join(ROOT_DIR, virtualPath);
    fs.readdir(filePath, function(err, files) {
        if(err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Server Error");
        }

        var html = "<p>Index of " + filePath + "</p>";
        html += "<ul>";
        html += files.map(function(item) {
            var newFilePath = path.join(virtualPath, item);
            return "<li><a href='" + newFilePath + "'>" + item + "</a></li>";
        }).join("");
        html += "</ul>";
        res.end(html);
    })
}

/** @function serveFile
 * Serves the specified file with the provided response object
 * @param {string} virtualPath - specifies the path to find the file at without the base directory
 * @param {http.serverResponse} res - the http response object
 */
function serveFile(virtualPath, res) {
    var filePath = path.join(ROOT_DIR, virtualPath);
    fs.readFile(filePath, function(err, data) {
        if(err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Server Error: Could not read file");
            return;
        }

        var type = virtualPath.split('.').pop()
        if( (type == "html") ||
            (type == "css") || 
            (type == "js")) {
            type = "text/" + type
        } else if ( (type == "jpeg") ||
                    (type == "png") ||
                    (type == "gif")) {
            type = "image/" + type
        }
        res.setHeader('Content-Type', type)
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
    var virtualPath = req.url
    var filePath = path.join(ROOT_DIR, virtualPath);
    fs.exists(filePath, function(exists) {
        if(exists) {
            fs.stat(filePath, function(err, stats) {
                if(err) {
                    console.log(err)
                    res.statusCode = 404;
                    res.end("File type could not be found");        
                }

                if (stats.isDirectory()) {
                    fs.exists(path.join(filePath, 'index.html'), function(exists) {
                        if(exists) {
                            serveFile(path.join(virtualPath, 'index.html'), res);
                        } else {
                            serveIndex(virtualPath, res);
                        }
                    });
                } else if (stats.isFile()) {
                    serveFile(virtualPath, res);
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