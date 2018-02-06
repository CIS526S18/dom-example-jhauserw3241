const http = require('http');

const PORT=3000;

function handleRequest(req, res) {
    var html = "<!doctype html>";
    html +=    "<html>";
    html +=    "    <head>";
    html +=    "        <title>Hello world</title>";
    html +=    "    </head>";
    html +=    "    <body>";
    html +=    "        <h1>Hello World!</h1>";
    html +=    "        time is: "
    html +=             Date.now.strftime("MM DD YYYY");
    html +=    "    </body>";
    html +=    "</html>";
    res.setHeader("ContentType", "text/html");
    res.end(html);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Listening at port ", PORT);
})