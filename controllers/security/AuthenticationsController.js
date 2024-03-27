import { CreateUserWithEmailAndPassword, SendPasswordResetEmail, SignInWithEmailAndPassword } from '../../tools/authenticationFirebase.js'
import path from 'node:path'
import { StringValidation, GetResource } from '../../tools/FieldsValidation.js'
import { AuthenticationsRepository } from '../../repositories/security/AuthenticationsRepository.js'
import { SessionData } from '../../SessionData.js'
import { BaseController } from '../BaseController.js'

export class AuthenticationsController {
  static async SignInSignUp (req, res, next) {
    try {
      const language = req.language.code === 'en' ? '_en' : 'es'
      res.sendFile(path.join(path.resolve(), 'views', 'security', 'authentication', 'index_' + language + '.html'))
    } catch (error) {
      next(error)
    }
  }

  static async SignUp (req, res, next) {
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const { name, email, password } = req.body
    const authenticationsRepository = new AuthenticationsRepository({ userID: '', name, email, languageCode })
    const context = req.context.db('IsavConfig')

    try {
      await authenticationsRepository.Validations({ method: 'SignUp' })

      await StringValidation({
        languageCode,
        field: 'password',
        value: password,
        required: true
      })

      await CreateUserWithEmailAndPassword({ name, email, password })
      const message = await GetResource({ languageCode, field: 'authentication', text: 'verification_sent_to' })
      const collection = context.collection('Users')

      await collection.insertOne({ email, name })
      res.send({ success: true, message: message.toString().replace('{0}', email) })
    } catch (error) {
      await authenticationsRepository.SetMessageByErrorCode({ error })
      next(error)
    }
  }

  static async SignIn (req, res, next) {
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const { email, password } = req.body
    const authenticationsRepository = new AuthenticationsRepository({ userID: '', name: '', email, languageCode })

    try {
      await authenticationsRepository.Validations({ method: 'SignIn' })

      await StringValidation({
        languageCode,
        field: 'password',
        value: password,
        required: true
      })

      const result = await SignInWithEmailAndPassword(email, password)
      if (result.userCredential.user.emailVerified) {
        const views = 1
        // const session = req.session
        // if (session) { views = req.session.data.views += 1 }
        req.session.data = new SessionData()
        req.session.data.set(SessionData.propertyEmailVerified, result.userCredential.user.emailVerified)
        req.session.data.set(SessionData.propertyEmail, result.userCredential.user.email)
        req.session.data.set(SessionData.propertyUid, result.userCredential.user.uid)
        req.session.data.set(SessionData.propertyLastLoginDateTime, new Date())
        req.session.data.set(SessionData.propertyViews, views)

        res.send({ success: true, emailVerified: result.userCredential.user.emailVerified, message: '' })
      } else {
        const message = await GetResource({ languageCode, field: 'authentication', text: 'verification_sent_to' })
        res.send({ success: true, message: message.toString().replace('{0}', result.userCredential.user.email) })
      }
    } catch (error) {
      await authenticationsRepository.SetMessageByErrorCode({ error })
      next(error)
    }
  }

  static async PasswordReset (req, res, next) {
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const { email } = req.body
    const authenticationsRepository = new AuthenticationsRepository({ userID: '', name: '', email, languageCode })

    try {
      await authenticationsRepository.Validations({ method: 'SignIn' })

      await SendPasswordResetEmail({ email })
      const message = await GetResource({ languageCode, field: 'authentication', text: 'password_reset_email_sent' })
      res.send({ success: true, message: message.toString() })
    } catch (error) {
      await authenticationsRepository.SetMessageByErrorCode({ error })

      next(error)
    }
  }

  static async SignOut (req, res, next) {
    const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
    const sesion = req.session
    if (sesion) {
      sesion.destroy(async (error) => {
        if (error) {
          const message = await GetResource({ languageCode, field: 'authentication', text: 'logout_error' })
          res.send({ success: false, message: message.toString() + ' ' + error.message })
          console.error('Error al cerrar la sesión:', error)
        } else {
          return res.redirect('/authentication')
        }
      })
    }
  }

  static async Test (req, res, next) {
    try {
      console.log('pl')
      const sessionData = BaseController.GetSessionData(req.session.data.sessionData)
      console.log(sessionData)
      res.send(sessionData)
    } catch (error) {
      next(error)
    }
  }
}
