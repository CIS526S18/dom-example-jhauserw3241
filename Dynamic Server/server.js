const http = require('http');
const fs = require('fs');
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
    var form = "<form method='POST'>"
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
    form +=    "    <input type='submit' value='Add Student' />"
    form +=    "</form>"

    return form;
}

function handleRequest(req, res) {
    if(req.method === "POST") {
        var body = "";

        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            student = qs.parse(body)

            students.push({
                name: escapeHtml(student.name),
                eid: escapeHtml(student.eid),
                description: escapeHtml(student.description)
            });
            fs.writeFile('students.json', JSON.stringify(students));
        });
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