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
      let priceStr = String(this.price);
      let length = priceStr.length;

      return '$' + priceStr.slice(0, length-2) + '.' + priceStr.slice(length-2, length)
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
          category: this.category,
          id: {
            $ne: this.id
          }
        }
      })
    }
  },
  hooks:{
    afterCreate: function(newTea){
      return Tea.findAll(
        { where: {
            id: { $ne: newTea.id }
          }
        })
      .then(teas => teas.map(tea => tea.update({
        price: tea.price - 100
      })))
    }
  }
})

module.exports = Tea
