import express, { json } from 'express'
import { usersRouter } from './routes/usersRoutes.js'
import { licensesRouter } from './routes/licensesRoutes.js'
import { authenticationRouters } from './routes/security/authenticationRouters.js'
import { ErrorHandler, ResourceNotFound } from './middleware/apiMiddleware.js'
import path from 'path'
import acceptLanguage from 'accept-language-parser'

const app = express()

// Detectar idioma
app.use((req, res, next) => {
  const lang = acceptLanguage.parse(req.headers['accept-language'])[0]
  req.language = lang
  next()
})

// Quitar de la cabeceta http la etiqueta x-powered-by: Express con el fin de no crear brecha de seguridad
app.disable('x-powered-by')

app.use(json())

// Servir archivos estáticos desde la carpeta 'build/dist' de React
app.use(express.static(path.join(path.resolve(), 'views', 'dist')))
app.use(express.static(path.join(path.resolve(), 'views', 'security', 'authentications')))

// La ruta / retorna el HTML generado con react
app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'views', 'dist', 'index.html'))
})

// #region API

app.get('/api', (req, res) => {
  res.send('¡Bienvenido a la página de inicio! API v: 1.1.10')
})

// secutity
app.use('/secutity', authenticationRouters)

// #region API FIN

// #region Users

// Para evitar error CORS en put, delete .. etc
app.options('api/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')// Todo manejar por dominio para no permitir de todo lado
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.send(200)
})

app.use('/api/users', usersRouter)

// #region Users FIN

// #region Licenses

// Para evitar error CORS en put, delete .. etc
app.options('api/licenses', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')// Todo manejar por dominio para no permitir de todo lado
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.send(200)
})

app.use('/api/licenses', licensesRouter)

// #region Licenses FIN

// #region errores

usersRouter.get('api/error', (req, res) => { throw new Error('error handling') })
usersRouter.post('api/error', (req, res) => { throw new Error('error handling') })

// Si la url no es captura por ninguno de los metos anteriores llegaria a este metodo que captura todo
app.use(ResourceNotFound)

// Manajeador de errores global
app.use(ErrorHandler)

// #region errores FIN

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
