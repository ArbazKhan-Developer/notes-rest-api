require("dotenv").config();
const http = require("http");
const path = require("path");
const notesRestApi = require("./src/api/notesRestApi");
const PORT = process.env.PORT;
const server = http.createServer(async (req, res) => {
  await new notesRestApi().process(req, res);
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
