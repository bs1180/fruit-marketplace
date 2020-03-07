import React from "react";
import Head from "next/head";

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({ children, title = "" }) => {
  return (
    <div className="bg-gray-100 min-h-screen bg-pattern">
      <Head>
        <title>Ben's Fruit Marketplace | {title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
