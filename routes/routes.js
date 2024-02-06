import { authenticationRouters } from './security/authenticationRouters.js'
import { pagesRouters } from './security/pagesRouters.js'
import { usersRouter } from './usersRoutes.js'
import { licensesRouter } from './licensesRoutes.js'

export class Routes {
  constructor (app) {
    console.log('Create Routes')
    this._app = app
  }

  Set = () => {
    console.log('Set Routes')
    this._app.get('/api', (req, res) => {
      res.send('¡Bienvenido a la página de inicio! API v: 1.1.10')
    })

    // Puthentication
    this._app.use('/authentication', authenticationRouters)

    // Pages
    this._app.use('/pages', pagesRouters)

    // Users
    this._app.use('/api/users', usersRouter)
    this._app.options('api/users', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*')// Todo manejar por dominio para no permitir de todo lado
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
      res.send(200)
    })

    // Licenses
    this._app.use('/api/licenses', licensesRouter)
    this._app.options('api/licenses', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*')// Todo manejar por dominio para no permitir de todo lado
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
      res.send(200)
    })
  }
}
