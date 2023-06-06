import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";

const UPDATE_PRODUCT_MUTATION = `
mutation updateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        variants (first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
    }
  }
`;

export default async function productUpdater(
  session,
  { id, title, variants }
) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    await client.query({
      data: {
        query: UPDATE_PRODUCT_MUTATION,
        variables: {
          input: {
            id,
            title,
            variants:variants.map((item)=> {
              let obj = {
                price: item.price
              }
              return obj;
            }),
          }
        },
      },
    });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}