'use strict'

const chai = require('chai')
const expect = chai.expect
const db = require('../src/index.js')
const Tea = db.models.tea
const { createTeas } = require('../src/seed')
// createTeas saves 5 different types of teas to the database

describe('Tea Model', () => {
  beforeEach(() => db.sync({ force: true }))
  beforeEach('Creating test data...', createTeas)

  // Sequelize getter for price in dollars: 525 --> $5.25
  describe('Virtual: dollarPrice', () => {
    it('returns the price of the tea as a formatted string', () => {
      const tea = Tea.build({
        price: 500
      })

      expect(tea.dollarPrice).to.equal('$5.00')
    })
  })

  // Class method: Tea.findByCategory('black')
  describe('Class Method: findByCategory', () => {
    it('should find all teas in a given category', () =>
      Tea.findByCategory('black')
      .then(teas => {
        expect(teas).to.have.length(2)
      })
    )
  })

  // Sequelize instance method to find similar
  describe('Instance Method: findSimilar', () => {
    it('should find other teas of the same category as the instance', () => Tea.findById(1)
    .then(earlGrey => earlGrey.findSimilar())
    .then(similarTeas => expect(similarTeas).to.have.length(1))
    )
  })

  // Sequelize hook - update?
  describe('Hook', () => {
    it('should decrease the price of all teas already in the db every time you add a new one', () =>
      Tea.create({
        title: 'Chai Tea',
        price: 1095,
        description: 'This ancient recipe of black tea spiced with Indian herbs and spices produces a warm, soothing drink that will soothe and satisfy.',
        category: 'black'
      })
      .then(() => Tea.findById(1))
      .then(earlGrey => {
        expect(earlGrey.price).to.equal(425)
      })
    )
  })
})
