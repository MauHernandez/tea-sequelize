'use strict'

const Sequelize = require('sequelize')
const db = require('./_db')

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal')
}, {
  getterMethods:{
    dollarPrice: function(){
      return '$'+String(this.price).charAt(0)+'.'+String(this.price).slice(1,3)
    }
  }, 
  classMethods:{
    findByCategory: function(category){
      return Tea.findAll({
        where:{
          category: category
        }
      })
    }
  },
  instanceMethods:{
    findSimilar: function(){
     return Tea.findAll({
        where:{
          category: this.category
        }
      }) 
    }
  },
  hooks:{
    afterCreate: function(){
      return Tea.update(
        {price: 425},
        { where: {id:1} }
        )
    }
  }
})

module.exports = Tea
