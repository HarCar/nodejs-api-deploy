import { Router } from 'express'
import { AuthenticationsController } from '../../controllers/security/AuthenticationsController.js'
import { BaseController } from '../../controllers/BaseController.js'
import { PagesController } from '../../controllers/security/PagesController.js'

export const authenticationRouters = Router()

// Authentication
authenticationRouters.get('/', AuthenticationsController.SignInSignUp)
authenticationRouters.post('/signup', AuthenticationsController.SignUp)
authenticationRouters.post('/signin', AuthenticationsController.SignIn)
authenticationRouters.post('/sasswordreset', AuthenticationsController.PasswordReset)
authenticationRouters.post('/signout', AuthenticationsController.SignOut)
authenticationRouters.get('/test', BaseController.ValidateSession, AuthenticationsController.Test)

// Pages
authenticationRouters.get('/get', PagesController.Get)
authenticationRouters.get('/post', PagesController.Intert)
