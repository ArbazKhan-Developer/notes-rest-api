var jwt = require("jsonwebtoken");
const mongodal = require("../dal/mongoDal");
const dbModal = require("../modal/mongoDbSchemaModal");

class authService {
  static async varifyUser(req, res) {
    try {
      const token = req.rawHeaders[1].split(" ")[1];
      console.log("token", token);
      const user = await jwt.verify(token, process.env.SECRET_TOKEN);
      const modal = await dbModal.userModal();
      const checkUser = await mongodal.getData(modal, { email: user.email });
      if (checkUser.statusCode !== 200) {
        res.writeHead(401, { "Content-Type": "text/html" });
        res.end("user does not exis, kindly signup.");
      }
      return user.userId;
    } catch (error) {
      console.log("error occurred in auth service", error.message);
      res.writeHead(401, { "Content-Type": "text/html" });
      res.end(await utils.stringifyData(error.message));
    }
  }
}

module.exports = authService;
