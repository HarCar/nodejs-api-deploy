import express, { json } from 'express'
import { usersRouter } from './routes/usersRoutes.js'
import { ErrorHandler, ResourceNotFound } from './middleware/apiMiddleware.js'

const app = express()

// Quitar de la cabeceta http la etiqueta x-powered-by: Express con el fin de no crear brecha de seguridad
app.disable('x-powered-by')

app.use(json())

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio! App v: 1.1.4')
})

// #region API

// #region  Users

// Para evitar error CORS en put, delete .. etc
app.options('api/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')// Todo manejar por dominio para no permitir de todo lado
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.send(200)
})

app.use('/api/users', usersRouter)

usersRouter.get('api/error', (req, res) => { throw new Error('error handling') })
usersRouter.post('api/error', (req, res) => { throw new Error('error handling') })

// #endregion

// Si la url no es captura por ninguno de los metos anteriores llegaria a este metodo que captura todo
app.use(ResourceNotFound)

// Manajeador de errores global
app.use(ErrorHandler)

// #endregion

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
