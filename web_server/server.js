const http = require('node:http');
const fs = require('node:fs');
/*const path = require('node:path');
const indexFilePath = path.join(__dirname, 'index.html');*/
const HOSTNAME ='localhost';
const PORT = 1100;
const fileHandler = (req, res) =>  {
    console.log({url : req.url, method: req.method})
    //res.setHeader("Content-Type", "text/html");
    if(req.url.endsWith('.html') && req.method === 'GET') {
        try {
        const splitUrl = req.url.split('/')
        const filename = splitUrl[1]
        const fileLocation =`./${filename}`
        console.log(fileLocation)
        const html = fs.readFileSync(fileLocation)
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.write(html);
        res.end();
        } catch (err) {
        const errorHtml = fs.readFileSync('./404.html')
        res.setHeader("Content-Type", "text/html");
        res.writeHead(404);
        res.write(errorHtml);
        res.end();

        }
    }
    i/*f(req.url ==='/index.html'){
        fs.readFile(indexFilePath, (err, html) =>{
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end("Error loading HTML file");
            } else {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.write(html);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
            res.end('404 Error. Route not found');
    }*/
}
const server = http.createServer(fileHandler)
server.listen(PORT, HOSTNAME, ()=>{
    console.log(`Server started successfully at http://${HOSTNAME}:${PORT}`);
})