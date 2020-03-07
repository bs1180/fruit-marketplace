// when an order is placed we have a number of steps to complete, such as sending confirmation emails, processing the payment etc.
// In this demo we just have two parts: validate the pricing (to ensure nothing was tampered with)
// 2. send the different line_items to the correct supplier(s)
// We do this async because it's possible actions will fail occasionally, and we don't want to block the order
export default (req, res) => {
  // 1 - check the pricing was calculated correctly
  // 2 - allocate the stock
  // 3 - relay the order to the upstream suppliers
  /*
  group by order and then split



  */

  res.json({ hello: "world" });
};
