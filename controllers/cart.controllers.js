const Order = require("../model/carts.model");
const orderItem = require("../model/orderItems.model");
const createOrder = async (req, res) => {
  try {
    const orderItemsId = req.body.orderItems?.map(async (orderitem) => {
      let neworderitems = new orderItem({
        quantity: orderitem.quantity,
        product: orderitem.product,
      });
      const orderItems = await neworderitems.save();
      return orderItems._id;
    });
    const orderItemsResolved = await orderItemsId;
    const newOrder = new Order({
      orderItems: orderItemsResolved,
      address: req.body.address,
      totalPrice: req.body.totalPrice,
      phone: req.body.phone,
      user: req.body.user,
    });
    const order = await newOrder.save();
    if (!order)
      return res
        .status(401)
        .json({ success: false, message: "cannot create Product in cart" });
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Internal server error" });
  }
};

module.exports = { createOrder };
