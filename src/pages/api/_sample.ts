// Sample webhook, for testing

export const sample = {
  payload: {
    event: {
      session_variables: {
        "x-hasura-role": "admin"
      },
      op: "INSERT",
      data: {
        old: null,
        new: {
          email: "ben@example.com",
          name: "Ben Smith",
          total: 1000,
          created_at: "2020-03-12T21:21:15.390296+00:00",
          delivery_address: "123 Fake Street",
          id: 9
        }
      }
    },
    created_at: "2020-03-12T21:21:15.390296Z",
    id: "bbd6a3f3-e9ba-45b3-9dfe-cc9c79f4fabf",
    delivery_info: {
      max_retries: 0,
      current_retry: 0
    },
    trigger: {
      name: "process_order"
    },
    table: {
      schema: "public",
      name: "orders"
    }
  },
  headers: [
    {
      value: "application/json",
      name: "Content-Type"
    },
    {
      value: "hasura-graphql-engine/v1.2.0-beta.2",
      name: "User-Agent"
    }
  ],
  version: "2"
};
