const menuRouter = require("./menu.routers");
const useRouter = require("./user.routers");
const orderRouter = require("./order.routers");
module.exports = (app) => {
  app.use("/api/product", menuRouter);
  app.use("/api/users", useRouter);
  app.use("/api/cart", orderRouter);
};
