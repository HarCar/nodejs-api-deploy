import express, { json } from 'express'
import { usersRouter } from './routes/usersRoutes.js'

const app = express()

// Quitar de la cabeceta http la etiqueta x-powered-by: Express con el fin de no crear brecha de seguridad
app.disable('x-powered-by')

app.use(json())

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio! App v: 1.1.2')
})

// Para evitar error CORS en put, delete .. etc
app.options('/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.send(200)
})

app.use('/users', usersRouter)

// Si la url no es captura por ninguno de los metos anteriores llegaria a este metodo que captura todo
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
