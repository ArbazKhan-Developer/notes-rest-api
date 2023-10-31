const fs = require("fs");
const path = require("path");
const utils = require("../utils/utils");
const notesHandlerService = require("../service/notesRequestHandlerService");
const authService = require("../service/authService");

class noteRestApi {
  async process(req, res) {
    try {
      if (req.method == "GET" && req.pathname == "getNotes") {
        req.userId = await authService.varifyUser(req, res);
        await notesHandlerService.getHandler(req, res);
      } else if (req.method == "POST" && req.pathname == "uploadNotes") {
        req.userId = await authService.varifyUser(req, res);
        await notesHandlerService.postHandler(req, res);
      } else if (req.method == "DELETE" && req.pathname == "remove") {
        req.userId = await authService.varifyUser(req, res);
        await notesHandlerService.deleteHandler(req, res);
      } else if (req.method == "PUT" && req.pathname == "update") {
        req.userId = await authService.varifyUser(req, res);
        await notesHandlerService.updateHandler(req, res);
      } else {
        const staticPath = path.join(__dirname, "../static/routeNotFound.html");
        const responseData = fs.readFileSync(staticPath, "utf-8");
        res.writeHead(401, { content: "application/json" });
        res.write(responseData);
        res.end();
      }
    } catch (error) {
      console.log("error occurred in router api", error.message);
      res.writeHead(400, { content: "application/json" });
      res.end(await utils.stringifyData(error.message));
    }
  }

  async getRequest(req, res) {
    try {
      const staticPath = path.join(__dirname, "../static/response.html");
      console.log(staticPath);
      const responseData = fs.readFileSync(staticPath, "utf8");
      res.writeHead(200, { content: "text/html" });
      res.write(responseData);
      res.end();
    } catch (error) {
      console.log('error occurred while fetching static data', error.message);
      res.writeHead(400, {content: 'application/json'});
      res.end(await utils.stringifyData(error.message));
    }
  }
}

module.exports = noteRestApi;
