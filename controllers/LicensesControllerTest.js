import { LicensesRepository } from '../repositories/LicensesRepository.js'

export class LicensesController {
  static async get (req, res, next) {
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new LicensesRepository({ context, languageCode })

    try {
      res.header('Access-Control-Allow-Origin', '*')
      const { rol, age } = req.query

      const data = await repository.get({ rol, age })
      res.json({
        success: true,
        message: null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async userDelete (req, res, next) {
    const context = req.context.db('IsavConfig')
    const { id } = req.query
    const collection = context.collection('user')
    await collection.insertOne({ ID: id })

    console.log(id)

    res.json({
      success: true,
      message: '',
      data: id
    })
  }

  static async find (req, res, next) {
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new LicensesRepository({ context, languageCode })

    try {
      const { id } = req.params
      const data = await repository.find({ id })

      res.json({
        success: true,
        message: data === null ? `No se encontro registro con id = ${id}` : null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async findByName (req, res, next) {
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new LicensesRepository({ context, languageCode })

    try {
      const { name } = req.params
      const data = await repository.findByName({ name })

      res.json({
        success: true,
        // message: data === null ? `No se encontro registro con nombre = ${name}` : null,
        message: data === null ? '*** La licencia ha expirado.***' : null,
        found: data !== null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async post (req, res, next) {
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new LicensesRepository({ context, languageCode })
    console.log(req.body)
    try {
      const result = await repository.insert({ objet: req.body })
      const data = result.insertedId
      res.json({
        success: true,
        message: 'Registro gurdado',
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async patch (req, res, next) {
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new LicensesRepository({ context, languageCode })

    try {
      const { id } = req.params

      const result = await repository.update({ id, objet: req.body })

      res.json({
        success: true,
        message: result.modifiedCount > 0 ? 'Registro gurdado' : '',
        modifiedCount: result.modifiedCount
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete (req, res, next) {
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new LicensesRepository({ context, languageCode })

    try {
      const { id } = req.params
      const result = await repository.delete({ id })

      res.json({
        success: true,
        message: result.deletedCount > 0 ? 'Registro borrado' : '',
        deletedCount: result.deletedCount
      })
    } catch (error) {
      next(error)
    }
  }
}
