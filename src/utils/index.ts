import Dinero from "dinero.js";

export const money = amount => Dinero({ amount, currency: "EUR" }).toFormat("$0,0.00");
