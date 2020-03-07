import * as React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { NextPage } from "next";
import api from "../utils/api";

const IndexPage: NextPage<any> = ({ products }) => {
  return (
    <Layout title="Marketplace">
      <div className="flex mx-auto items-center justify-center min-h-screen">
        <div
          className="grid gap-3 overflow-hidden"
          style={{ gridTemplateColumns: "repeat(3, 120px)", gridAutoRows: "120px" }}
        >
          {products.map(product => (
            <div
              key={product.id}
              className="bg-black bg-center bg-cover rounded-full overflow-hidden shadow-lg border"
              style={{
                backgroundImage: product.image_url ? `url('${product.image_url}')` : undefined
              }}
            >
              <Link href={`/products/[slug]?slug=${product.slug}`} as={`/products/${product.slug}`} passHref>
                <a className="bg-white hover:bg-transparent w-full inline-flex h-full items-center justify-center hover:text-transparent">
                  {product.name}
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

IndexPage.getInitialProps = async () => {
  const res = await api.fetchProducts();
  const products = res.data.products ?? [];
  return { products };
};

export default IndexPage;
