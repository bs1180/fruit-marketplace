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
              }
        }`,
        variables: { slug }
      })
      .post()
      .json<any>()
};
