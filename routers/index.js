const menuRouter = require("./menu.routers");
const useRouter = require("./user.routers");
module.exports = (app) => {
  app.use("/api/menuCake", menuRouter);
  app.use("/api/users", useRouter);
};
