const mongoDal = require("../dal/mongoDal");
const dbSchemaModal = require("../modal/mongoDbSchemaModal");
const utils = require("../utils/utils");

class notesRequestHandlerService {
  static async postHandler(req, res) {
    try {
      let body = "";
      req.on("data", function (data) {
        body += data.toString();
        console.log("partial body", body);
      });
      req.on("end", async function () {
        const modal = await dbSchemaModal.notesModal();
        body = await utils.parseElement(body);
        body.userId = await req.userId;
        console.log("Body: " + body);
        const data = await mongoDal.postData(body, modal);
        console.log(`data received: ${data}`);
        res.writeHead(data.statusCode, { "Content-Type": "application/json" });
        res.end(await utils.stringifyData(data));
      });
    } catch (error) {
      console.log(`error occourred in notesRequestHandler: ${error}`);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(await utils.stringifyData(error.message));
    }
  }

  static async getHandler(req, res) {
    try {
      const modal = await dbSchemaModal.notesModal();
      console.log(`queryParam`, req.queryParam);
      let regex = new RegExp(`^${req.queryParam.title}.*$`, "ig");
      let queryParam = req.queryParam.title? { userId: req.userId, title: { $regex: regex }} : { userId: req.userId}
      console.log(`queryParam`,  queryParam);
      const data = await mongoDal.getData(modal, queryParam);
      res.writeHead(data.statusCode, { "Content-Type": "application/json" });
      res.end(await utils.stringifyData(data.body));
    } catch (error) {
      console.log(`error occurred in getHandler`, error.errorno);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(await utils.stringifyData(error.message));
    }
  }

  static async deleteHandler(req, res) {
    try {
      const modal = await dbSchemaModal.notesModal();
      const queryParam = { userId: req.userId };
      const data = await mongoDal.deleteData(modal, queryParam);
      res.writeHead(data.statusCode, { "Content-Type": "text/html" });
      res.end(await utils.stringifyData(data));
    } catch (error) {
      console.log(`error occurred in getHandler`, error.errorno);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(await utils.stringifyData(error.message));
    }
  }

  static async updateHandler(req, res) {
    try {
      const queryParam = req.queryParam;
      let body = "";
      req.on("data", function (data) {
        body += data.toString();
        console.log("partial body", body);
      });
      req.on("end", async function () {
        console.log("Body: " + body);
        const modal = await dbSchemaModal.notesModal();
        body = await utils.parseElement(body);
        const data = await mongoDal.updateData(body, modal, queryParam);
        console.log(`data received:`, data);
        res.writeHead(data.statusCode, { "Content-Type": "application/json" });
        res.end(await utils.stringifyData(data));
      });
    } catch (error) {
      console.log(`error occurred in getHandler`, error.errorno);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(await utils.stringifyData(error.message));
    }
  }
}

module.exports = notesRequestHandlerService;
