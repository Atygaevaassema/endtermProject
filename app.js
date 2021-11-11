var http = require('http');
var fs = require('fs');

function serveStaticFile(res, path, contentType, responseCode) {
    if (!responseCode) { responseCode = 200; }
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("500 - Internal Error");
        }
        else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    })
}

http.createServer(function (req, res) {

    var types = new Map([
        ['jpg', 'image/jpeg'],
        ['css', 'text/css'],
        ['js', 'application/javascript']
    ]);

    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();

    var splittedPath = path.split('/');

    // For static files in html template
    if (splittedPath[1] == 'static') {
        var lastStr = splittedPath[splittedPath.length - 1];
        var contentTypeForStatic = types.get(lastStr.slice(lastStr.lastIndexOf('.') + 1));

        if (contentTypeForStatic != null) {
            serveStaticFile(res, path, contentTypeForStatic);
        }
    }

    else {
        switch (path) {
            case '':
                serveStaticFile(res, '/index.html', 'text/html');
                break;
            case '/about':
                serveStaticFile(res, '/about.html', 'text/html');
                break;
            case '/img/graduation.jpg':
                serveStaticFile(res, '/img/gallery/graduation.jpg', 'image/jpeg');
                break;
            case '/img/study.jpg':
                serveStaticFile(res, '/img/gallery/study.jpg', 'image/jpeg');
                break;
            case '/video/memes.mp4':
                serveStaticFile(res, '/video/students/memes.mp4', 'video/mp4');
                break;
            default:
                serveStaticFile(res, '/error.html', 'text/html', 404);
                break;
        }
    }
}).listen(3000);

console.log("Server started on localhost:3000; press Ctrl+C to terminate");