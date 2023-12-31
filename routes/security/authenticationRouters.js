import { Router } from 'express'
import { AuthenticationsController } from '../../controllers/security/AuthenticationsController.js'

export const authenticationRouters = Router()

authenticationRouters.get('/', AuthenticationsController.signInSignUp)
