/** In this demo, an order can be sent to a supplier via two different channels: Email or simple API call
 * The Supplier interface is an abstraction over this underlying detail, and would be implemented for each different method.
 * It's likely that some implementations might be supplier specific (if they use a custom ERP) but others could be generic (like our email example)
 */
import wretch from "wretch";
import "isomorphic-unfetch";
import * as nodemailer from "nodemailer";

interface LineItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: LineItem[];
  name: string;
  email: string;
  delivery_address: string;
}

interface Supplier {
  placeOrder(order: Order): Promise<void>;
}

export class EmailNotifier implements Supplier {
  transporter: nodemailer.Transporter;
  email: string;

  constructor(email: string) {
    this.email = email;

    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        // These are disposable credentials for https://ethereal.email - you can login and see the real email with them
        user: "hayden.donnelly@ethereal.email",
        pass: "99nZZTxFswwgDGFPNX"
      }
    });
  }
  async placeOrder(order: Order) {
    return this.transporter.sendMail({
      from: "orders@example.com",
      to: this.email,
      subject: "New order!",
      text: `
      A new order has been received for you!

      Name: ${order.name}

      Delivery Address: ${order.delivery_address}

      Items: \n
        ${order.items.map(item => `- ${item.name} x ${item.quantity}\n`)}
      `
    });
  }
}

export class ApiNotifier implements Supplier {
  apiUrl: string;
  apiKey: string;

  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async placeOrder(order) {
    return wretch(this.apiUrl)
      .auth(this.apiKey)
      .post(order);
  }
}
