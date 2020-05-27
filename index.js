const { Mongoose } = require('mongoose');
const paginationController = require('./setup');
const { SEQUELIZE, MONGOOSE } = require('./helper');

module.exports = async ({model, args, attribute, orderBy = "DESC"}) => {

  if(model && model.prototype && model.prototype.db && model.prototype.db.base){

    return await paginationController(model, args, attribute, orderBy, MONGOOSE);

  }else{

    return await paginationController(model, args, attribute, orderBy, SEQUELIZE);

  }
  
}