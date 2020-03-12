import Dinero from "dinero.js";

export const money = (amount, quantity = 1) =>
  amount
    ? Dinero({ amount, currency: "EUR" })
        .multiply(quantity)
        .toFormat("$0,0.00")
    : null;
