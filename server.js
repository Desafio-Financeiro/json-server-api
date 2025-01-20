const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require("cors");

server.use(cors());
server.use(middlewares);

server.get("/balance", (req, res) => {
  const userId = req.query.userId;
  const db = router.db;

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
