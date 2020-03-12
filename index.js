const { Op } = require("sequelize");

module.exports = async (Model, args, attribute, orderBy) => {
  const { skip, after, before, first, last, LIMIT = 10, _where = {} } = args;

  let hasPreviousPage = false;
  let hasNextPage = false;

  let results = [];

  //if skip is not null, skip is offset
  if (
    typeof skip === "number" &&
    typeof first === "number" &&
    skip >= 0 &&
    first >= 1
  ) {
    hasPreviousPage = skip > 0;
    results = await Model.findAll({
      where: { ..._where },
      order: [[attribute, orderBy]],
      limit: first + 1,
      offset: skip
    });
    hasNextPage = results.length > first;
    results = results.slice(0, first);
    if (after === "String") {
      hasPreviousPage = true;
      results = await Model.findAll({
        order: [[attribute, orderBy]],
        limit: first + 1,
        where: {
          ..._where,
          [attribute]: { [Op.gt]: after }
        }
      });
      hasNextPage = results.length > first;
      results = results.slice(0, first);
    }
  } else if (before && last) {
    hasNextPage = true;
    results = await Model.findAll({
      order: [[attribute, orderBy]],
      limit: last + 1,
      where: {
        ..._where,
        [attribute]: { [Op.lt]: before }
      }
    });
    hasPreviousPage = results.length > last;
    results = results.slice(0, last).reverse();
  } else {
    //if no args then return all with default limit
    hasPreviousPage = false;
    results = await Model.findAll({
      order: [[attribute, orderBy]],
      limit: LIMIT + 1,
      offset: 0,
      where: {
        ..._where
      }
    });
    hasNextPage = results.length > LIMIT;
    results = results.slice(0, LIMIT);
  }
  let start = null;
  let end = null;
  if (results.length > 0) {
    start = results[0][attribute];
    end = results[results.length - 1][attribute];
  }

  const edges = await Promise.all(
    results.map(async result => {
      return {
        node: await result,
        cursor: result[attribute]
      };
    })
  );
  const count = await Model.count();

  return {
    pageInfo: {
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
      startCursor: start,
      endCursor: end
    },
    edges,
    totalCount: count
  };
};
