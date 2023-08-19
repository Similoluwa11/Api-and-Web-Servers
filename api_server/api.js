const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const filePath = path.join(__dirname, 'items.json')

const PORT = 1200;
const HOSTNAME = 'localhost';
//const items = [];

const responseHandler = (req, res) => ({ code = 200, error = null, data = null}) =>{
    res.setHeader('content-type', 'application/json')
    res.writeHead(code)
    res.write(JSON.stringify({ data, error}))
    res.end()
}
const bodyParser = (req, res, callback) => {
    const body = [];
    req.on('data', (chunk) => {
        body.push(chunk)
    })
    req.on('end', () => {
        if (body.length) {
            const parsedBody = Buffer.concat(body).toString()
            req.body = JSON.parse(parsedBody);
        }
        callback(req, res)
    })
}
const requestHandler = (req, res) => {
const response = responseHandler(req, res)
if (req.url === '/items' && req.method === 'POST') {
    fs.readFile(filePath, 'utf8', (err, data)=>{
        if (err) {
            console.log(err)
            res.writeHead(400)
            res.end()
        }
        const oldItems = JSON.parse(data)
        const newItem = { ...req.body, id: Math.floor(Math.random() * 50).toString()}
        const allItems = [...oldItems, newItem]

    fs.writeFile(filePath, JSON.stringify(allItems), (err)=>{
        if(err) {
            console.log(err)
            res.writeHead(500)
            res.end(JSON.stringify({message: 'Internal Server Error'}))
        } res.end(JSON.stringify(newItem))
    })

    })
   
} 
if (req.url === '/items' && req.method === 'GET') {
    //return response({ data: items, code: 200})
    fs.readFile(filePath, 'utf8', (err, data)=> {
        if(err) {
            console.log(err)
            res.writeHead(404)
            res.end()
        }
        res.end(data)
    })
} 
if (req.url.startsWith('/items/') && req.method === 'GET') {
    const id = req.url.split('/')[2]
    const sportItems =   fs.readFileSync(filePath)
    const itemObj= JSON.parse(sportItems)
    const indexOfItem = itemObj.findIndex((item)=> item.id === id)
    if(indexOfItem === -1) {
        return response({code: 404, error: 'Item not found'})
    }
    res.end(JSON.stringify(itemObj[indexOfItem]))

    //const item = items[indexOfItem]
    //return response({ data: item, code: 200})
} 
if (req.url.startsWith('/items/') && req.method === 'PATCH') {
    const id = req.url.split('/')[2]
    const sportItems =   fs.readFileSync(filePath)
    const itemObj= JSON.parse(sportItems)
    const indexOfItem = itemObj.findIndex((item)=> item.id === id)
    
    if(indexOfItem === -1) {
        return response({code: 404, error: 'Item not found'})
    }
    const updatedItem = { ...itemObj[indexOfItem], ...req.body}
    itemObj[indexOfItem] =  updatedItem
    fs.writeFile(filePath, JSON.stringify(itemObj), (err)=>{
        if(err) {
            console.log(err)
            res.writeHead(500)
            res.end(JSON.stringify({message: 'Internal Server Error'}))
        } 
        res.writeHead(200)
        res.end('Successful Update')
    })

    //return response({ data: item, code: 200})
}
if (req.url.startsWith('/items/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2]
    const sportItems =   fs.readFileSync(filePath)
    const itemObj= JSON.parse(sportItems)
    const indexOfItem = itemObj.findIndex((item)=> item.id === id)
    if(indexOfItem === -1) {
        return response({code: 404, error: 'Item not found'})
    } 
    itemObj.splice(indexOfItem, 1)
    fs.writeFile(filePath, JSON.stringify(itemObj), (err)=>{
        if(err) {
            console.log(err)
            res.writeHead(500)
            res.end(JSON.stringify({message: 'Internal Server Error'}))
        } 
        res.writeHead(200)
        res.end('Successful Deletion')
    })
    //return response({ data: items, code: 200})
}
}

//console.log(items);
const server = http.createServer((req, res) => bodyParser(req, res, requestHandler))
server.listen(PORT, HOSTNAME, ()=> {
    console.log(`Server started at  http://${HOSTNAME}:${PORT}`)
})