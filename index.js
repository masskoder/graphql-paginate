const mongoose = require('mongoose');
const paginationController = require('./setup');
const { SEQUELIZE, MONGOOSE } = require('./helper');

module.exports = async ({model, args, attribute, orderBy = "DESC"}) => {

  if(model instanceof mongoose.Model){

    return await paginationController(model, args, attribute, orderBy, MONGOOSE);

  }else{

    return await paginationController(model, args, attribute, orderBy, SEQUELIZE);

  }
  
}