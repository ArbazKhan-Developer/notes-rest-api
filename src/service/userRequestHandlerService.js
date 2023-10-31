const mongoDal = require("../dal/mongoDal");
const dbSchemaModal = require("../modal/mongoDbSchemaModal");
const utils = require("../utils/utils");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

class userRequestHandlerService {
  static async signupHandler(req, res) {
    try {
      let body = "";
      req.on("data", function (data) {
        body += data.toString();
      });
      req.on("end", async function () {
        console.log("Body: " + body);
        body = await utils.parseElement(body);
        const modal = await dbSchemaModal.userModal();
        const data = await mongoDal.getData(modal, { email: body.email });
        // check if user exist
        if (data.statusCode == 204) {
          if (body.password === body.confirmPassword) {
            body.password = await bcrypt.hash(body.password, saltRounds);
            body.confirmPassword = await bcrypt.hash(
              body.confirmPassword,
              saltRounds
            );
            const data = await mongoDal.postData(body, modal);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(await utils.stringifyData(data.body));
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end("password and confirmPassword did not match.");
          }
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end("user already exists.");
        }
      });
    } catch (error) {
      console.log(`error occourred in notesRequestHandler: ${error.message}`);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(await utils.parseElement(error.message));
    }
  }

  static async signinHandler(req, res) {
    try {
      let body = "";
      req.on("data", function (data) {
        body += data.toString();
      });
      req.on("end", async function () {
        body = await utils.parseElement(body);
        const modal = await dbSchemaModal.userModal();
        const data = await mongoDal.getData(modal, { email: body.email });
        // check if user exist
        if (data.statusCode == 204) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end("user does not exis, kindly signup.");
        } else {
          let comparePassword = await bcrypt.compare(
            body.password,
            data.body.data[0].password
          );
          if (comparePassword) {
            let payload = {
              userId: data.body.data[0]["_id"],
              email: data.body.data[0].email,
            };
            let token = jwt.sign(payload, process.env.SECRET_TOKEN);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify(
                await utils.stringifyData({
                  message: "user logged in successfully",
                  token,
                })
              )
            );
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end("invalid credential.");
          }
        }
      });
    } catch (error) {
      console.log(`error occourred in notesRequestHandler: ${error}`);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(await utils.stringifyData(error.message));
    }
  }
}

module.exports = userRequestHandlerService;
