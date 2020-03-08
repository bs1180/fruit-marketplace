import * as React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { NextPage } from "next";
import api from "../utils/api";
import { useCart } from "react-use-cart";
import { money } from "../utils";
import { useForm } from "react-hook-form";

const Basket: React.FC<any> = ({ items = [] }) => {
  return (
    <div>
      <div className="uppercase text-gray-400 font-semibold text-sm text-center mb-4">Your order</div>
      <table className="w-full">
        <tbody>
          {items.map(item => (
            <tr key={item.key} className="">
              <td className="text-left w-1/3 p-2">{item.name}</td>
              <td className="text-sm text-gray-400 text-center w-1/3 p-2">
                {item.quantity} x {money(item.price)}
              </td>
              <td className="text-right w-1/3 p-2">{money(item.price, item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CheckoutPage: NextPage<any> = ({ products }) => {
  const { items, isEmpty, cartTotal, emptyCart } = useCart();
  const { register, handleSubmit } = useForm();

  const createOrder = async values => {
    try {
      console.log(values);
      emptyCart();
      // const res = await api.createOrder({ items, ... values })
      // redirect to /order/id with ?thanks
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout title="Checkout">
      <div className="flex mx-auto pb-16 max-w-sm">
        <div className="bg-white rounded shadow-solid text-black w-full">
          <div className="p-8 border-b-2 border-black">
            <h1 className="font-bold text-center text-2xl">Checkout</h1>
          </div>
          <div className="p-8 border-b-2 border-black">
            {isEmpty ? <div>Cart is empty!</div> : <Basket items={items} />}
          </div>
          <div className="p-8">
            <form className="stack" onSubmit={handleSubmit(createOrder)}>
              <label className="block">
                <span className="label">Name</span>
                <input className="input" placeholder="Jane Doe" />
              </label>
              <label className="block">
                <span className="label">Email Address</span>
                <input className="input" placeholder="john@example.com" />
              </label>
              <label className="block">
                <span className="label">Delivery Address</span>
                <textarea className="input" />
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" checked />
                <span className="ml-2">I accept the Terms and Conditions</span>
              </label>
              <button type="submit" className="bg-black w-full text-white rounded p-3">
                Place order now - {money(cartTotal)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
