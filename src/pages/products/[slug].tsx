import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import api from "../../utils/api";
import { money } from "../../utils";
import { useCart } from "react-use-cart";
import { Card, Minus, Plus } from "../../components";

const ProductPage: NextPage<any> = ({ product }) => {
  const { addItem, getItem, updateItemQuantity, isEmpty, totalUniqueItems, cartTotal } = useCart();

  if (!product) {
    return <div>404</div>;
  }

  const { id, name, price, description, image_url, unit, supplier } = product;

  const item = getItem(product.id);

  return (
    <Layout title={name}>
      <div className="flex max-w-sm mx-auto pb-8">
        <div className="w-full flex flex-col bg-white shadow-solid text-black rounded-lg p-8 items-center stack">
          {image_url && (
            <div>
              <img className="rounded-full bg-center bg-cover shadow-solid" alt="" src={image_url} />
            </div>
          )}

          <h1 className="font-bold text-2xl text-center">{name}</h1>
          <div className="label">
            Supplied by{" "}
            <Link href={`/suppliers/[slug]?slug=${supplier?.slug}`} as={`/suppliers/${supplier?.slug}`} passHref>
              <a className="underline">{supplier?.name}</a>
            </Link>
          </div>
          {description && <p className="text-gray-600 text-base text-center">{description}</p>}

          <div className="label">
            {money(price)} / {unit}
          </div>
          <div className="flex w-full justify-center">
            {item ? (
              <div className="flex items-center justify-around w-24">
                <button onClick={() => updateItemQuantity(product.id, item.quantity - 1)}>
                  <Minus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItemQuantity(product.id, item.quantity + 1)}>
                  <Plus />
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
