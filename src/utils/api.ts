import "isomorphic-unfetch";
import wretch from "wretch";
import { propOr } from "ramda";

const baseApi = wretch().url("http://localhost:8080/v1/graphql");

interface FetchProductsResponse {
  data: any;
}

export default {
  fetchProducts: () =>
    baseApi
      .json({
        query: `query {
          products {
      id
      name
      slug
      supplier {
        id
        name
        slug
      }
      image_url(args: { width: 200, height: 200 })
    }
  }`
      })
      .post()
      .json<FetchProductsResponse>(),

  fetchProduct: slug =>
    baseApi
      .json({
        query: `query ($slug: String!) {
                products(where: { slug: { _eq: $slug}}) {
                  id
                  name
                  description
                  price
                  image_url(args: { width: 200, height: 200 })
                  unit
              }
        }`,
        variables: { slug }
      })
      .post()
      .json<any>(),
  createOrder: ({ items, name, email, delivery_address }) => {
    return baseApi
      .json({
        query: `mutation createOrder($items: [line_items_insert_input!]!, $name: String!, $email: String!, $delivery_address: String!) {
        insert_orders_one(object: {line_items: {data: $items}, email: $email, delivery_address: $delivery_address, name: $name}) {
          id
        }
      }
      `,
        variables: { items, name, email, delivery_address }
      })
      .post()
      .json<any>();
  },
  fetchSupplier: slug => {
    return baseApi
      .json({
        query: `query ($slug: String!) {
              suppliers(where: { slug: { _eq: $slug}}) {
                id
                name
                orders {
                  id
                  name
                  created_at
                }
                orders_aggregate {
                  aggregate {
                    count
                  }
                }
                products {
                  id
                  name
                }
            }
      }`,
        variables: { slug }
      })
      .post()
      .json<any>();
  }
};
