import { SessionData } from '../SessionData.js'

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
}
