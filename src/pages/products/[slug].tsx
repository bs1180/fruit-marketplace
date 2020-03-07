import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import api from "../../utils/api";
import { money } from "../../utils";

const ProductPage: NextPage<any> = ({ product }) => {
  if (!product) {
    return <div>404</div>;
  }

  return (
    <Layout title={product.name}>
      <Link href="/" passHref>
        <a className="opacity-75 bg-white px-4 py-3 rounded-full shadow">Back</a>
      </Link>
      <div className="flex max-w-md mx-auto flex-col bg-white shadow-lg items-center rounded-lg p-8">
        {product.image_url && <img className="rounded-full bg-center bg-cover" alt="" src={product.image_url} />}
        <div className=" py-4 my-4 px-4">
          <h1 className="font-bold text-xl mb-2 text-center">{product.name}</h1>
          <p className="text-gray-700 text-base">{product.description}</p>
        </div>
        <div>{money(product.price)}</div>
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
