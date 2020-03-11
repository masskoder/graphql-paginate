# Graphql-Pagination

GraphQL pagination helper that makes it easy to get pagination response.

For moment support only MYSQL and POSTGRESQL database with Sequelize.

### Installation

```
npm install graphql-paginate
```

### Usage

```javascript
const pagination = require("graphql-paginate");
module.exports = async function getTransactions(parent, args, context) {
  const { db } = context;
  const { UserTransaction } = db;

  return pagination(UserTransaction, args, "id", "DESC");
};
```

### Response Schema

```
 {

  "pageInfo":  {
    "endCursor": 2,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "startCursor": 1,
  },
   "edges": Array [
     {
      "cursor": 1,
      "node":  {
        "id": 1,
        "name": "user 1",
      },
    },
     {
      "cursor": 2,
      "node":  {
        "id": 2,
        "name": "user 2",
      },
    },
  ],
  "totalCount": 5,

```
