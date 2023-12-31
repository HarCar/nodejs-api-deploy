import path from 'path'

export class AuthenticationsController {
  static async signInSignUp (req, res, next) {
    try {
      const language = req.language.code === 'en' ? '_en' : ''
      res.sendFile(path.join(path.resolve(), 'views', 'security', 'authentications', 'signInSignUp' + language + '.html'))
    } catch (error) {
      next(error)
    }
  }
}
