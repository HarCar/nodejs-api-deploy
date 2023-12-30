import { Router } from 'express'
import { LicensesController } from '../controllers/licensesController.js'

export const licensesRouter = Router()

licensesRouter.get('/', LicensesController.get)

licensesRouter.get('/:id', LicensesController.find)

licensesRouter.get('/name/:name', LicensesController.findByName)

licensesRouter.post('/', LicensesController.post)

licensesRouter.patch('/:id', LicensesController.patch)

licensesRouter.delete('/:id', LicensesController.delete)

licensesRouter.get('/error', (req, res) => { throw new Error('error handling') })
licensesRouter.post('/error', (req, res) => { throw new Error('error handling') })
