import Dinero from "dinero.js";

export const money = (amount = 0, quantity = 1) =>
  Dinero({ amount, currency: "EUR" })
    .multiply(quantity)
    .toFormat("$0,0.00");
