import * as React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { NextPage } from "next";
import api from "../utils/api";
import { useCart } from "react-use-cart";
import { formatMoney } from "../utils";
import { useForm, ErrorMessage } from "react-hook-form";
import { useRouter } from "next/router";

const ErrorLabel = props => <div className="text-red-600" {...props} />;

const Basket: React.FC<any> = ({ items = [] }) => {
  return (
    <div>
      <div className="uppercase text-gray-400 font-semibold text-sm text-center mb-4">Your order</div>
      <table className="w-full">
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="">
              <td className="text-left w-1/3 p-2">{item.name} </td>
              <td className="text-sm text-gray-400 text-center w-1/3 p-2">
                {item.quantity} x {formatMoney(item.price)}
              </td>
              <td className="text-right w-1/3 p-2">{formatMoney(item.price, item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CheckoutPage: NextPage<any> = () => {
  const { items, isEmpty, cartTotal, emptyCart } = useCart();
  const { register, handleSubmit, errors, formState } = useForm();
  const router = useRouter();

  const createOrder = async values => {
    try {
      const { name, email, delivery_address } = values;
      const formattedItems = items.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const res = await api.createOrder({ items: formattedItems, name, delivery_address, email });

      emptyCart();
      router.push("/orders/[id]", `/orders/${res?.data?.insert_orders_one?.id}/?m=thanks`);
    } catch (err) {
      console.log(err);
      // TODO: Show nice error
      alert("Failed to submit order");
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
                <input
                  className="input"
                  name="name"
                  placeholder="Jane Doe"
                  ref={register({ required: "Required" })}
                />
              </label>
              <ErrorMessage errors={errors} name="name" as={<ErrorLabel />} />
              <label className="block">
                <span className="label">Email Address</span>
                <input
                  className="input"
                  placeholder="john@example.com"
                  name="email"
                  ref={register({ required: "Required" })}
                />
              </label>
              <ErrorMessage errors={errors} name="email" as={<ErrorLabel />} />
              <label className="block">
                <span className="label">Delivery Address</span>
                <textarea className="input" name="delivery_address" ref={register({ required: "Required" })} />
              </label>
              <ErrorMessage errors={errors} name="delivery_address" as={<ErrorLabel />} />
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="terms"
                  ref={register({ required: "Must accept terms and conditions" })}
                />
                <span className="ml-2">I accept the Terms and Conditions</span>
              </label>
              <ErrorMessage errors={errors} name="terms" as={<ErrorLabel />} />

              <button
                type="submit"
                className={`w-full text-white rounded p-3 btn ${isEmpty ? "bg-gray-600" : "bg-black"}`}
                disabled={formState.isSubmitting || isEmpty}
              >
                {formState.isSubmitting ? "Submitting..." : `Place order ${isEmpty ? "" : formatMoney(cartTotal)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
