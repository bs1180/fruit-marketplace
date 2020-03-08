import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { money } from "../utils";
import Link from "next/link";
import Chevron from "./Chevron";
import { ShoppingCart } from "./ShoppingCart";

type Props = {
  title?: string;
  hideBack?: boolean;
};

const Layout: React.FunctionComponent<Props> = ({ children, title = "", hideBack = false }) => {
  const router = useRouter();
  const { totalUniqueItems, cartTotal } = useCart();
  return (
    <div className="bg-gray-100 min-h-screen bg-pattern">
      <Head>
        <title>Ben's Fruit Marketplace | {title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <div className="flex justify-between p-4 flex-end">
          {!hideBack && (
            <a
              onClick={() => router.back()}
              className="opacity-75 bg-white flex items-center justify-center h-8 w-8 rounded-full shadow-solid text-black block cursor-pointer"
            >
              <Chevron />
            </a>
          )}

          <Link href="/checkout" passHref>
            <a className="opacity-75 bg-white flex flex-col h-16 w-16 items-center justify-center rounded-full shadow-solid text-black block ml-auto">
              <ShoppingCart />
              <div className="text-xs font-semibold">{money(cartTotal ?? 0)}</div>
            </a>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;
