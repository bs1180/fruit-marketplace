import * as React from "react";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import api from "../../utils/api";
import { formatMoney, formatDate } from "../../utils";
import { Card, Section } from "../../components";
import { useRouter } from "next/router";

const Thanks = () => (
  <div className="flex items-center justify-center p-3 border-b-2 border-black bg-green-200">
    Your order has been received and will ship shortly
  </div>
);

const OrderPage: NextPage<any> = ({ order }) => {
  const router = useRouter();

  if (!order) {
    return <div>404</div>;
  }

  const title = `Order #${order.id}`;
  const showThanks = router.query.m === "thanks";

  return (
    <Layout title={title}>
      <div className="flex max-w-md mx-auto items-center justify-center ">
        <Card title={title} description={`Recieved ${formatDate(order.created_at)}`}>
          {showThanks ? <Thanks /> : null}
          <dl className="striped w-full">
            <Section title="Name">{order.name}</Section>
            <Section title="Email">{order.email}</Section>
            <Section title="Delivery Address">{order.delivery_address}</Section>
            <Section title="Contents">
              <div className="grid grid-cols-2">
                {order.line_items.map(item => (
                  <>
                    <div>{item.name}</div>
                    <div className="text-right">
                      {item.quantity} x {formatMoney(item.price)}
                    </div>
                  </>
                ))}
                <>
                  <div className="font-bold">Total</div>
                  <div className="text-right">{formatMoney(order.total)}</div>
                </>
              </div>
            </Section>
          </dl>
        </Card>
      </div>
    </Layout>
  );
};

OrderPage.getInitialProps = async ({ query: { id } }) => {
  const res = await api.fetchOrder(id);

  const order = res.data?.order;
  return { order };
};

export default OrderPage;
