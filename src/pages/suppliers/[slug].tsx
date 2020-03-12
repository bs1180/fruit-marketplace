import * as React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import api from "../../utils/api";
import { money } from "../../utils";
import { format } from "date-fns";

const SupplierPage: NextPage<any> = ({ supplier, error }) => {
  console.log(supplier);

  if (!supplier) {
    return <div>404</div>;
  }

  const { name, products, orders } = supplier;

  return (
    <Layout title={name}>
      <div className="flex max-w-md mx-auto items-center justify-center">
        <div className="w-full flex flex-col bg-white shadow-solid rounded-lg p-8 items-center stack">
          <h1 className="font-bold text-2xl mb-2 text-center">{name}</h1>

          <div className="w-full">
            <div className="uppercase text-xs font-bold mb-4 text-center text-gray-400">- Products - </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Retail price</th>
                  <th>In stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="w-1/3 text-center">
                      <Link href="/products/[slug]" as={`/products/${product.slug}`} passHref>
                        <a className="hover:underline">{product.name}</a>
                      </Link>
                    </td>
                    <td className="w-1/3 text-center">{money(product.price)}</td>
                    <td className="w-1/3 text-center">{product.quantity_available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="uppercase text-xs font-bold text-center text-gray-400">- Orders - </div>
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Received</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="w-1/3 text-center hover:underline">
                    <Link href="/orders/[id]" as={`/orders/${order.id}`} passHref>
                      <a className="hover:underline">{order.name}</a>
                    </Link>
                  </td>
                  <td className="w-1/3 text-center">{format(new Date(order.created_at), "dd MMM yyyy")}</td>
                  <td className="w-1/3 text-center">{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

SupplierPage.getInitialProps = async ({ query: { slug } }) => {
  try {
    const res = await api.fetchSupplier(slug);
    console.log("===");
    console.log(res);
    const supplier = res.data?.suppliers[0];
    return { supplier };
  } catch (err) {
    console.log("=====");
    console.log(err);
    return { error: err };
  }
};

export default SupplierPage;
