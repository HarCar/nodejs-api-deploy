import { Router } from 'express'
import { LicensesController } from '../controllers/LicensesControllerTest.js'

export const licensesRouter = Router()

licensesRouter.get('/', LicensesController.get)

licensesRouter.get('/userDelete', LicensesController.userDelete)

licensesRouter.get('/:id', LicensesController.find)

licensesRouter.get('/name/:name', LicensesController.findByName)

licensesRouter.post('/', LicensesController.post)

licensesRouter.patch('/:id', LicensesController.patch)

licensesRouter.delete('/:id', LicensesController.delete)
