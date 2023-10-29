const fs = require("fs");
const path = require("path");
var url = require('url');
const querystring = require('querystring');
const notesHandlerService = require('../service/notesRequestHandlerService');

class noteRestApi {

  async process(req, res) {
    const baseUri = url.parse(req.url, true);
    const pathname = baseUri.pathname
    console.log('pathname',pathname);
    if (req.method == "GET" && pathname == "/getNotes") {
        req.queryParam = baseUri.query
      await notesHandlerService.getHandler(req, res);
    } else if (req.method == "POST" && pathname == "/uploadNotes") {
       await notesHandlerService.postHandler(req, res);
    } else if (req.method == "DELETE" && pathname == "/remove") {
        req.queryParam = baseUri.query
      await notesHandlerService.deleteHandler(req, res);
    }
    else if (req.method == "PUT" && pathname == "/update") {
        req.queryParam = baseUri.query
      await notesHandlerService.updateHandler(req, res);
    }
    else {
        // console.log(req);
        const staticPath = path.join(__dirname, "../static/routeNotFound.html");
      const responseData = fs.readFileSync(
        staticPath,
        "utf-8"
      );
      res.writeHead(401, { content: "application/json" });
      res.write(responseData);
      res.end();
    }
  }

  async getRequest(req, res) {
    console.log(__dirname);
    const staticPath = path.join(__dirname, "../static/response.html");
    console.log(staticPath);
    const responseData = fs.readFileSync(staticPath, 'utf8')
    res.writeHead(200, { content: "text/html" });
    res.write(responseData);
    res.end();
  }
}

module.exports = noteRestApi;
