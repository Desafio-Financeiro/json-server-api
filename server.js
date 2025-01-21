const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const db = JSON.parse(fs.readFileSync(path.join("db.json")));

server.use(cors());

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite qualquer origem
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Métodos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Cabeçalhos permitidos

  // Trata requisições OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Responde com status "No Content"
  }

  next(); // Continua para a próxima rota ou middleware
});

server.use(middlewares);

server.get("/balance", (req, res) => {
  const userId = req.query.userId;

  const transactions = db.get("transactions").value();

  const total = transactions
    .filter((t) => t.userId === userId)
    .reduce((acc, curr) => {
      if (curr.type === "saque") return acc - curr.value;

      return acc + curr.value;
    }, 0);

  return res.json({ total });
});

server.use(router);

server.listen(8080, () => {
  console.log("JSON Server is running on port 8080");
});
