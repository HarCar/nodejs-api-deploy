import { Router } from 'express'
import { PagesController } from '../../controllers/security/PagesController.js'

export const pagesRouters = Router()

// Pages
pagesRouters.get('/get', PagesController.Get)
pagesRouters.get('/post', PagesController.Intert)
