const { Op } = require("sequelize");
const Promise = require('bluebird');
const { SEQUELIZE } = require('./helper');

module.exports = async (Model, args, attribute, orderBy, orm) => {
  const {
    skip,
    after,
    before,
    first,
    last,
    limit = 10,
    _where = {}
  } = args;

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

    if (orm === SEQUELIZE) {
      results = await Model.findAll({
        where: {
          ..._where
        },
        order: [
          [attribute, orderBy]
        ],
        limit: first + 1,
        offset: skip
      });
    } else {
      results = await Model.find({
          ..._where
        })
        .skip(skip)
        .limit(first + 1)
        .sort({
          [attribute]: orderBy.toLowerCase()
        });
    }

    hasNextPage = results.length > first;
    results = results.slice(0, first);

    if (after === "String") {
      hasPreviousPage = true;

      if (orm === SEQUELIZE) {
        results = await Model.findAll({
          order: [
            [attribute, orderBy]
          ],
          limit: first + 1,
          where: {
            ..._where,
            [attribute]: {
              [Op.gt]: after
            }
          }
        });
      } else {
        results = await Model.find({
            ..._where,
            [attribute]: {
              $gt: after
            }
          })
          .limit(first + 1)
          .sort({
            [attribute]: orderBy.toLowerCase()
          });
      }

      hasNextPage = results.length > first;
      results = results.slice(0, first);
    }

  } else if (before && last) {
    hasNextPage = true;

    if (orm === SEQUELIZE) {
      results = await Model.findAll({
        order: [
          [attribute, orderBy]
        ],
        limit: last + 1,
        where: {
          ..._where,
          [attribute]: {
            [Op.lt]: before
          }
        }
      });
    } else {
      results = await Model.find({
          ..._where,
          [attribute]: {
            $lt: before
          }
        })
        .limit(last + 1)
        .sort({
          [attribute]: orderBy.toLowerCase()
        });
    }

    hasPreviousPage = results.length > last;
    results = results.slice(0, last).reverse();
  } else {
    //if no args then return all with default limit
    hasPreviousPage = false;

    if (orm === SEQUELIZE) {
      results = await Model.findAll({
        order: [
          [attribute, orderBy]
        ],
        limit: limit + 1,
        offset: 0,
        where: {
          ..._where
        }
      });
    } else {
      results = await Model.find({
          ..._where
        })
        .skip(0)
        .limit(limit + 1)
        .sort({
          [attribute]: orderBy.toLowerCase()
        });
    }

    hasNextPage = results.length > limit;
    results = results.slice(0, limit);
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

  let count = 0;

  if (orm === SEQUELIZE) {
    count = await Model.count();
  } else {
    count = await Model.countDocuments({});
  }

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