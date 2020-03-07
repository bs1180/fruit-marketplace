import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import api from "../../utils/api";
import { money } from "../../utils";
import { useCart } from "react-use-cart";

const ProductPage: NextPage<any> = ({ product }) => {
  const { addItem, getItem, updateItemQuantity } = useCart();

  if (!product) {
    return <div>404</div>;
  }

  const { id, name, price, description, image_url } = product;

  const item = getItem(product.id);

  return (
    <Layout title={name}>
      <Link href="/" passHref>
        <a className="opacity-75 bg-white px-4 py-3 rounded-full shadow absolute m-8">Back</a>
      </Link>
      <div className="flex max-w-md mx-auto items-center justify-center min-h-screen">
        <div className="w-full flex flex-col bg-white shadow-lg rounded-lg p-8 items-center">
          {image_url && (
            <div>
              <img className="rounded-full bg-center bg-cover" alt="" src={image_url} />
            </div>
          )}
          <div className=" py-4 my-4 px-4">
            <h1 className="font-bold text-2xl mb-2 text-center">{name}</h1>
            {description && <p className="text-gray-700 text-base">{description}</p>}
          </div>
          <div>{money(price)}</div>
          <div className="flex w-full">
            {item ? (
              <div>
                <button className="border p-2" onClick={() => updateItemQuantity(product.id, item.quantity - 1)}>
                  -
                </button>
                {item.quantity}
                <button className="border p-2" onClick={() => updateItemQuantity(product.id, item.quantity + 1)}>
                  +
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-black text-white px-4 py-3 rounded"
                onClick={() => addItem({ id, name, price })}
              >
                Add to basket
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

ProductPage.getInitialProps = async ({ query: { slug } }) => {
  const res = await api.fetchProduct(slug);
  const product = res.data?.products[0];
  return { product };
};

export default ProductPage;
