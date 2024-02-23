import { SessionData } from '../SessionData.js'
import { BaseRepository } from '../repositories/BaseRepository.js'

export class BaseController {
  static ValidateSession (req, res, next) {
    if (!req.session.data) {
      return res.redirect('/login')
    } else {
      next()
    }
  }

  static GetSessionData (session) {
    const sessionData = new SessionData()
    sessionData.set(SessionData.propertyEmailVerified, session.emailVerified)
    sessionData.set(SessionData.propertyEmail, session.email)
    sessionData.set(SessionData.propertyUid, session.uid)
    sessionData.set(SessionData.propertyLastLoginDateTime, session.lastLoginDateTime)
    sessionData.set(SessionData.propertyViews, session.views)

    return sessionData
  }

  static async get (req, res, next) {
    const { collection } = req.params
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new BaseRepository({ context, languageCode, collection })

    try {
      const queryParams = req.query
      console.log(queryParams)
      const data = await repository.get({ queryParams })
      res.json({
        success: true,
        message: null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async find (req, res, next) {
    const { collection } = req.params
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new BaseRepository({ context, languageCode, collection })

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
    const { collection } = req.params
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new BaseRepository({ context, languageCode, collection })

    try {
      const { name } = req.params
      const data = await repository.findByName({ name })

      res.json({
        success: true,
        message: data === null ? `No se encontro registro con nombre = ${name}` : null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async post (req, res, next) {
    const { collection } = req.params
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new BaseRepository({ context, languageCode, collection })
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
    const { collection } = req.params
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new BaseRepository({ context, languageCode, collection })

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
    const { collection } = req.params
    const context = req.context.db('IsavConfig')
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const repository = new BaseRepository({ context, languageCode, collection })

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
