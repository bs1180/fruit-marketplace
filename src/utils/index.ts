import Dinero from "dinero.js";
import { format } from "date-fns";

export const formatMoney = (amount, quantity = 1) =>
  amount
    ? Dinero({ amount, currency: "EUR" })
        .multiply(quantity)
        .toFormat("$0,0.00")
    : null;

export const formatDate = date => (date ? format(new Date(date), "dd MMM yyyy") : null);
