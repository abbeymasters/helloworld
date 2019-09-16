var queryString = require('querystring');
    fs = require('fs');
    formidable = require('formidable');

function start(res) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" ' +
        'content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="submit" value="Upload File" />' +
        '</form>' +
        '</body>' +
        '</html>';    

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(body);
    res.end();

}

function upload(res, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log('About to parse.');
    form.parse(request, function(error, fields, files) {
        console.log('Parsing done.');


        fs.rename(files.upload.path, "./test-image.jpg", function(error) {
            if(error) {
                fs.unlink("./test-image.jpg");
                fs.rename(files.upload.path, "./test-image.jpg");
            }
        });

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("received image: <br/>");
    res.write("<img src='/show' />");
    res.end();
    });
}

function show(res) {
    console.log("Request handler 'show' was called.");
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream('./test-image.jpg').pipe(res);
}

exports.start = start;
exports.upload = upload;
exports.show = show;