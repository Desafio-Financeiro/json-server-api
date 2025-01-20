const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const fs = require("fs");
const path = require("path");
const db = JSON.parse(fs.readFileSync(path.join("db.json")));

server.use(middlewares);
server.use(router);

server.use((req, res, next) => {
  if (
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    req.path.startsWith("/transactions")
  ) {
    const transactions = db.get("transactions").value();
    const balances = db.get("balance").value();

    const updatedBalances = balances.map((balance) => {
      const userTransactions = transactions.filter(
        (transaction) => transaction.userId === balance.userId
      );

      const newCurrentAccount = userTransactions.reduce(
        (total, transaction) => {
          return transaction.type === "deposito"
            ? total + transaction.value
            : total - transaction.value;
        },
        0
      );

      return {
        ...balance,
        currentAccount: newCurrentAccount,
      };
    });

    db.set("balance", updatedBalances).write();
  }

  next();
});

server.listen(4000, () => {
  console.log("JSON Server is running");
});
