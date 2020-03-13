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
                  supplier {
                    id
                    name
                    slug
                  }
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
        query: `
          query ($slug: String!) {
            suppliers(where: { slug: { _eq: $slug}}) {
              id
              name
              orders {
                id
                name
                created_at
                total
                line_items {
                  id
                }
              }
              orders_aggregate {
                aggregate {
                  count
                }
              }
              products {
                id
                name
                price
                quantity_available
                slug
              }
              notification_method
              notification_url
              notification_email
            }
          }
      `,
        variables: { slug }
      })
      .post()
      .json<any>();
  },

  fetchOrder: id => {
    return baseApi
      .json({
        query: `query ($id: Int!) {
              order: orders_by_pk(id: $id) {
                id
                name
                email
                delivery_address
                created_at
                total
                  line_items {
                    id
                    name
                    price
                    quantity
                    product {
                      id
                      name
                      price
                      supplier {
                        id
                        name
                        slug
                      }
                    }
                  }
                }
          
      }`,
        variables: { id }
      })
      .post()
      .json<any>();
  },

  fetchProductsById: ids => {
    return baseApi
      .json({
        query: `query ($ids: [bigint!]!) {
          products(where: {id: {_in: $ids}}) {
            id
            name
            price
            quantity_available
          }
      }`,
        variables: { ids }
      })
      .post()
      .json<any>();
  },

  adjustStock: (id, quantity) => {
    return baseApi
      .json({
        query: `
        mutation ($id: bigint!, $quantity: Int! ) {
          update_products_by_pk(_inc: {quantity_available: $quantity}, pk_columns: {id: $id}) {
            id
            quantity_available
          }
        }
        
    `,
        variables: { id, quantity }
      })
      .post()
      .json<any>();
  },

  fetchSupplierCredentials: id => {
    return baseApi
      .json({
        query: `
          query ($id: Int!) {
            supplier: suppliers_by_pk(id: $id) {
              id
              notification_method
              notification_url
              notification_email
            }
          }
      `,
        variables: { id }
      })
      .post()
      .json<any>();
  }
};
