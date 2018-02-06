const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const PORT=3000;

// Load sync files here (cached)
var students = JSON.parse(fs.readFileSync("students.json", {"encoding": "utf-8"}));

function escapeHtml(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function studentList() {
    return students.map(function(item) {
        return item.name
    }).join(', ');
}

function studentForm() {
    var form = "<form>"
    form +=    "    <fieldset>"
    form +=    "        <label for='name'>Student Name</label>"
    form +=    "        <input type='text' name='name' />"
    form +=    "    </fieldset>"
    form +=    "    <fieldset>"
    form +=    "        <label for='eid'>Student Eid</label>"
    form +=    "        <input type='text' name='eid' />"
    form +=    "    </fieldset>"
    form +=    "    <fieldset>"
    form +=    "        <label for='description'>Description</label>"
    form +=    "        <textarea type='text' name='description'></textarea>"
    form +=    "    </fieldset>"
    form +=    "    <input type='submit' value='Submit' />"
    form +=    "</form>"

    return form;
}

function handleRequest(req, res) {
    // Load files async here, but adds more overhead

    var uri = url.parse(req.url);
    var params = qs.parse(uri.search.slice(1));

    if(params.name) {
        students.push({
            name: escapeHtml(params.name),
            eid: escapeHtml(params.eid),
            description: escapeHtml(params.description)
        });
        fs.writeFile('students.json', JSON.stringify(students));
    }

    var html = "<!doctype html>";
    html +=    "<html>";
    html +=    "    <head>";
    html +=    "        <title>Hello world</title>";
    html +=    "    </head>";
    html +=    "    <body>";
    html +=    "        <h1>Hello World!</h1>";
    html +=    studentList();
    html +=    studentForm();
    html +=    "    </body>";
    html +=    "</html>";
    res.setHeader("ContentType", "text/html");
    res.end(html);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Listening at port ", PORT);
})