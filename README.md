# Graphql-Pagination

GraphQL pagination helper that makes it easy to get pagination response.

Support only MYSQL and POSTGRESQL databases with Sequelize and also MONGODB with Mongoose

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

  return pagination({ model : UserTransaction, args, attribute : "id", orderBy : "DESC"});
};
```

### Response Schema (Sequelize)

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
