import express, { json } from 'express'
import { ErrorHandler, ResourceNotFound } from './middleware/apiMiddleware.js'
import path from 'path'
import acceptLanguage from 'accept-language-parser'
import session from 'express-session'
import { GetStore, Context } from './models/Context.js'
import { Routes } from './routes/routes.js'

const app = express()
const context = new Context()
context.connect()

app.use((req, res, next) => {
  req.context = context.getConnection()
  next()
})

app.use(
  session({
    store: GetStore(),
    secret: 'tu_secreto', // Deberías almacenar esto de forma segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
  })
)

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
app.use(express.static(path.join(path.resolve(), 'views', 'security', 'authentication')))
app.use(express.static(path.join(path.resolve(), 'views', 'public')))

const allowedExtensions = ['', '.html', '.js', '.css', '.png']
app.use((req, res, next) => {
  const ext = path.extname(req.path)
  if (!allowedExtensions.includes(ext)) {
    return res.status(403).send('Forbidden' + req.path)
  }
  next()
})

// app.get('/authentication', (req, res) => {
//   const languageCode = req.language !== undefined && req.language.code === 'en' ? 'en' : 'es'
//   res.sendFile(path.join(path.resolve(), 'views', 'security', 'authentication', 'index_' + languageCode + '.html'))
// })

app.get('/Nav', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'views', 'dist', 'index.html'))
})

const routes = new Routes(app)
routes.Set()

// #region errores

// Si la url no es captura por ninguno de los metos anteriores llegaria a este metodo que captura todo
app.use(ResourceNotFound)

// Manajeador de errores global
app.use(ErrorHandler)

// #region errores FIN

// Cierre de la conexión al detener la aplicación
process.on('SIGINT', async () => {
  if (context) {
    await context.closeConnection()
  }
  process.exit()
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
