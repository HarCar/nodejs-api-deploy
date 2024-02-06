import { PagesRepository } from '../../repositories/security/PagesRepository.js'
import { BaseController } from '../BaseController.js'
import { SessionData } from '../../SessionData.js'

export class PagesController {
  static async Intert (req, res, next) {
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const sessionData = BaseController.GetSessionData(req.session.data.sessionData)
    const context = req.context.db(sessionData.get[SessionData.propertyUid])
    const repository = new PagesRepository({ context, sessionData })

    try {
      const data = await repository.Get()
      res.json({
        languageCode,
        success: true,
        message: null,
        data
      })
    } catch (error) {
      error.languageCode = languageCode
      next(error)
    }
  }

  static async Get (req, res, next) {
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const sessionData = BaseController.GetSessionData(req.session.data.sessionData)
    const context = req.context.db(sessionData.get[SessionData.propertyUid])
    const repository = new PagesRepository({ context, sessionData })

    try {
      const data = await repository.Get()
      res.json({
        languageCode,
        success: true,
        message: null,
        data
      })
    } catch (error) {
      error.languageCode = languageCode
      next(error)
    }
  }
}
