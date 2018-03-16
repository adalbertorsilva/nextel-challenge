const BaseController = require('./base-controller')
const SuperPower = require('../models').SuperPower

class SuperPowerController extends BaseController {
  constructor () {
    super()
    this.ENTITY = 'SUPER POWER'      
  }

  async create (req, res, next) {
    try {
      const powerResponse = await SuperPower.create(req.body)
      await this.configRequestBypass(req, powerResponse)
      next() 
    } catch (error) {
      res.status(403).send({message: 'Super Power already exists'})
    }
  }

  async findAll (req, res) {
    const powers = await SuperPower.findAll({ offset: req.params.offset, limit: req.params.limit })
    res.status(200).send(powers.map(power => power.responseObject()))
  }

  async find (req, res) {
    const power = await SuperPower.findById(req.params.id)
    res.status(200).send(power.responseObject())
  }

  async update (req, res, next) {
    const power = await SuperPower.findById(req.params.id)
    const updatedPower = await power.updateAttributes(req.body)
    await this.configRequestBypass(req, updatedPower)
    next()
  }

  async delete (req, res, next) {
    const power = await SuperPower.findById(req.params.id)
    const heroes = await power.getHeroes()

    if (heroes.length > 0) {
      return res.status(403).send({message: 'Super power can not be removed because it has a super hero binded to it'})
    }

    await SuperPower.destroy({where:{id: req.params.id}})
    await this.configRequestBypass(req, power, {message: 'Super power removed'})
    next()
  }
}

module.exports = SuperPowerController