require("dotenv").config();
const http = require("http");
const path = require("path");
const url = require("url");
const notesRestApi = require("./src/api/notesRestApi");
const userrestApi = require("./src/api/usersRestApi");
const utils = require('./src/utils/utils');
const PORT = process.env.PORT;

const server = http.createServer(async (req, res) => {
  try {
    const baseUri = url.parse(req.url, true);
    const baseDir = baseUri.pathname.split("/")[1];
    req.pathname = baseUri.pathname.split("/")[2];
    req.queryParam = baseUri.query;
    if (baseDir == "notes") {
      await new notesRestApi().process(req, res);
    } else if (baseDir == "users") {
      await new userrestApi().process(req, res);
    } else {
      res.writeHead(404, { content: "application/json" });
      res.end("page not found");
    }
  } catch (error) {
    console.log('error occurred in server connection service', error.message);
    res.writeHead(400, {content: 'application/json'});
    res.end(await utils.stringifyData(error.message));
  }
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
