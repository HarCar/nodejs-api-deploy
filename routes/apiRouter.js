import { Router } from 'express'
import { BaseController } from '../controllers/BaseController.js'

export const apiRouter = Router()

apiRouter.get('/:collection/:id', BaseController.find)
apiRouter.get('/:collection/name/:name', BaseController.findByName)
apiRouter.get('/:collection', BaseController.get)
apiRouter.post('/:collection', BaseController.post)
apiRouter.patch('/:collection/:id', BaseController.patch)
apiRouter.delete('/:collection/:id', BaseController.delete)

apiRouter.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio! API v: 1.1.10')
})
