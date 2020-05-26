const paginationController = require('./setup');
const { SEQUELIZE, MONGOOSE } = require('./helper');

const ORM_CHECK = [ SEQUELIZE , MONGOOSE ];

const pagination = async (Model, args, attribute, orderBy, orm = SEQUELIZE) => {

  if(ORM_CHECK.includes(orm.toLowerCase())){

    return await paginationController(Model, args, attribute, orderBy, orm);

  }else{

    return [];

  }
  
}

module.exports = {
  pagination,
  SEQUELIZE,
  MONGOOSE
}