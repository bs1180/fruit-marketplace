/**
 * When an order is placed we have a number of steps to complete, such as sending confirmation emails, processing the payment etc.
 * We do this asyncronously because it's more reliable: some of the processing steps might fail temporarily, and we don't want to block the order
 *
 * In this demo we do three things:
 * 1. Validate the pricing (to ensure nothing was tampered with on the client)
 * 2. Decrement the stock levels
 * 3. Relay the different line items to the correct supplier
 *
 * In production these would be separated with message queues to ensure data isn't lost.
 **/

import { EmailNotifier, ApiNotifier } from "./_services";
import R from "ramda";
import api from "../../utils/api";
import { strict as assert } from "assert";

export default async (req, res) => {
  try {
    const orderId = req.body?.payload?.event?.data?.new?.id;

    assert(orderId, "Failed to extract order ID");

    const order = await api.fetchOrder(orderId).then(res => res?.data?.order);

    // 1. get all the products which are in the order, to check the current selling price
    const productIds = R.pipe(R.prop("line_items"), R.map(R.path(["product", "id"])))(order);

    const products = await api.fetchProductsById(productIds).then(res => res.data?.products ?? []);

    order.line_items.forEach(item => {
      const product = products.find(p => p.id === item.product.id);
      // This step ensures the basket was not tampered with
      assert(product.name === item.name, "Item name has been changed");
      assert(item.price === product.price, "Item price has been changed");
      /* We could also check the stock levels easily, but this would depend on business rules - generally you want to backorder items with insufficient stock, not reject them */
    });

    // 2. Relay the order to the upstream suppliers
    const grouped = R.pipe(R.prop("line_items"), R.groupBy(R.path(["product", "supplier", "id"])))(order);

    R.forEachObjIndexed(async (filteredItems, supplierId) => {
      const supplier = await api.fetchSupplierCredentials(supplierId).then(res => res?.supplier);

      const orderForSupplier = {
        id: order.id,
        name: order.name,
        email: order.email,
        delivery_address: order.delivery_address,
        // We only send the relevant order items to the specific supplier
        items: filteredItems
      };

      if (supplier.notification_method === "EMAIL") {
        await new EmailNotifier(supplier.notification_email).placeOrder(orderForSupplier);
      } else if (supplier.notification_method === "API") {
        await new ApiNotifier(supplier.notification_url, "secret_token").placeOrder(orderForSupplier);
      }
    })(grouped);

    // 3. if all good, then decrement the stock levels
    await Promise.all(order.line_items.map(item => api.adjustStock(item.product.id, -item.quantity)));

    return res.json({ ok: order.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
