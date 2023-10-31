const fs = require("fs");
const path = require("path");
const utils = require("../utils/utils");
const userHandlerService = require("../service/userRequestHandlerService");

class userRestApi {
  async process(req, res) {
    try {
      if (req.method == "POST" && req.pathname == "signup") {
        await userHandlerService.signupHandler(req, res);
      } else if (req.method == "POST" && req.pathname == "signin") {
        await userHandlerService.signinHandler(req, res);
      } else {
        const staticPath = path.join(__dirname, "../static/routeNotFound.html");
        const responseData = fs.readFileSync(staticPath, "utf-8");
        res.writeHead(401, { content: "application/json" });
        res.write(responseData);
        res.end();
      }
    } catch (error) {
      console.log("error occurred in userApi service", error.message);
      res.writeHead(400, { content: "application/json" });
      res.end(await utils.stringifyData(error.message));
    }
  }

  async getRequest(req, res) {
    try {
      const staticPath = path.join(__dirname, "../static/response.html");
      const responseData = fs.readFileSync(staticPath, "utf8");
      res.writeHead(200, { content: "text/html" });
      res.write(responseData);
      res.end();
    } catch (error) {
        console.log('error occurred in static data handling', error.message);
        res.writeHead(400, {content: 'application/json'});
        res.end(await utils.stringifyData(error.message));
    }
  }
}

module.exports = userRestApi;
