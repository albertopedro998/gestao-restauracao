const server = require("./app");

server.listen(3000, () => {
  console.log("Servidor rodando");
});

module.exports = server;
