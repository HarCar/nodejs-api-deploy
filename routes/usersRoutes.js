import { Router } from 'express'
import { UserController } from '../controllers/UserController.js'

export const usersRouter = Router()

usersRouter.get('/', UserController.get)

usersRouter.get('/:id', UserController.find)

usersRouter.post('/', UserController.post)

usersRouter.patch('/:id', UserController.patch)

usersRouter.delete('/:id', UserController.delete)

usersRouter.get('/error', (req, res) => { throw new Error('error handling') })
usersRouter.post('/error', (req, res) => { throw new Error('error handling') })
