import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import api from "../../utils/api";

const SupplierPage: NextPage<any> = ({ supplier }) => {
  if (!supplier) {
    return <div>404</div>;
  }

  const { name, products, orders } = supplier;

  return (
    <Layout title={name}>
      <div className="flex max-w-md mx-auto items-center justify-center min-h-screen">
        <div className="w-full flex flex-col bg-white shadow-lg rounded-lg p-8 items-center">
          <div className=" py-4 my-4 px-4">
            <h1 className="font-bold text-2xl mb-2 text-center">{name}</h1>
          </div>

          <div className="flex w-full">products</div>
          <div className="flex w-full">orders</div>
        </div>
      </div>
    </Layout>
  );
};

SupplierPage.getInitialProps = async ({ query: { slug } }) => {
  const res = await api.fetchSupplier(slug);
  const supplier = res.data?.suppliers[0];
  return { supplier };
};

export default SupplierPage;
