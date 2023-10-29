const mongoDal = require("../dal/mongoDal");
const dbSchemaModal = require("../modal/mongoDbSchemaModal");
const collectionName = process.env.DB_COLLECTION;
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
        console.log("in async fuction");
        console.log("Body: " + body);
        const schema = await dbSchemaModal.notesSchema();
        const data = await mongoDal.postData(body, collectionName, schema);
        console.log(`data received: ${data}`);
        res.writeHead(data.statusCode, { "Content-Type": "text/html" });
        res.end(await utils.stringifyData(data));
      });
    } catch (error) {
      console.log(`error occourred in notesRequestHandler: ${error}`);
      console.log(error.message);
    }
  }

  static async getHandler(req, res) {
    try {
      const schema = await dbSchemaModal.notesSchema();
      const queryParam = req.queryParam
      const data = await mongoDal.getData(collectionName, schema, queryParam);
      res.writeHead(data.statusCode, { "Content-Type": "text/html" });
      res.end(await utils.stringifyData(data));
    } catch (error) {
      console.log(`error occurred in getHandler`, error.errorno);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(error.message);
    }
  }

  static async deleteHandler(req, res) {
    try {
      const schema = await dbSchemaModal.notesSchema();
      const queryParam = req.queryParam
      const data = await mongoDal.deleteData(collectionName, schema, queryParam);
      res.writeHead(data.statusCode, { "Content-Type": "text/html" });
      res.end(await utils.stringifyData(data));
    } catch (error) {
      console.log(`error occurred in getHandler`, error.errorno);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(error.message);
    }
  }

  static async updateHandler(req, res) {
    try {
    const queryParam = req.queryParam
    let body = "";
      req.on("data", function (data) {
        body += data.toString();
        console.log("partial body", body);
      });
      req.on("end", async function () {
        console.log("Body: " + body);
        const schema = await dbSchemaModal.notesSchema();
        const data = await mongoDal.updateData(body, collectionName, schema, queryParam);
        console.log(`data received:`, data);
        res.writeHead(data.statusCode, { "Content-Type": "text/html" });
        res.end(await utils.stringifyData(data));
      });
    } catch (error) {
      console.log(`error occurred in getHandler`, error.errorno);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(error.message);
    }
  }
}

module.exports = notesRequestHandlerService;
