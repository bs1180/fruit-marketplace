This project contains a basic e-commerce application.

![Product page](/product_page.png?raw=true "Product page")

# Stack used

- Postgres
- Hasura
- React, with Typescript and the NextJS framework
- Tailwind CSS

Images are from unsplash.com
Background pattern from heropatterns.com

# Architecture

The backend is accessed via the GraphQL API, loading project and supplier data into the frontend. Whn items are added to the shopping cart, they are kept in browser local storage.
When the order is submitted, it is inserted into the orders table, and then Hasura uses a webhook to call the post-order endpoint, which contains most of the business logic. At this step, the basket is validated and the stock levels are reduced. The order is then relayed to the correct supplier, via one of two methods - email or api. This replicates a simple marketplace model, where orders are accepted on behalf of these suppliers and therefore should be immediately sent on.

This architecture would be highly scalable because it avoids typical bottlenecks - for example, because the frontend is stateless and the database access is only read-only, scaling up is trivial and can be achieved by adding adding additional resources. The subsequent order processing happens ascronously, and be easily broken across different systems and joined using message queues.

# Up and Running

1. Clone this repo

2. Install Hasura (Docker is easiest) and apply the migrations - https://hasura.io/docs/1.0/graphql/manual/migrations/new-database.html

3. Install the dependencies (`yarn install`)

4. Run the FE with `yarn build` and then `yarn start`
