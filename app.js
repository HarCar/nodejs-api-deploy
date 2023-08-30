const express = require('express')
const { ValidatePartialUser, ValidateUser } = require('./zod-validations.js')
const { GetUsers } = require('./user_list.js')
const app = express()

const userList = GetUsers()

// Quitar de la cabeceta http la etiqueta x-powered-by: Express con el fin de no crear brecha de seguridad
app.disable('x-powered-by')

app.use(express.json())

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!')
})

// Respuesta de api
const responseData = {
  success: true,
  data: null,
  message: ''
}

// Para evitar error CORS en put, delete .. etc
app.options('/user', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.send(200)
})

app.get('/users', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  const { rol, age } = req.query
  let dataFilter = userList
  if (rol) {
    dataFilter = dataFilter.filter(user => user.rol === rol)
  }
  if (age) {
    dataFilter = dataFilter.filter(user => user.age === parseInt(age))
  }

  responseData.data = dataFilter
  res.json(responseData)
})

app.get('/users/:id', (req, res) => {
  const { id } = req.params // Convertir a número
  const data = userList.find(user => user.id === parseInt(id))

  responseData.data = data === undefined ? null : data
  responseData.message = data === undefined ? `No se encontro el usuario con id = ${id}` : null
  res.json(responseData)
})

app.post('/user', (req, res) => {
  const result = ValidateUser(req.body)
  if (result.error) {
    responseData.message = JSON.parse(result.error.message)
    responseData.data = null
    responseData.success = false
    return res.status(400).json(responseData)
  }

  responseData.data = result.data
  userList.push(responseData.data)
  responseData.message = 'Registro gurdado'
  res.json(responseData)
})

app.patch('/user', (req, res) => {
  const result = ValidatePartialUser(req.body)
  if (result.error) {
    responseData.message = JSON.parse(result.error.message)
    responseData.data = null
    responseData.success = false
    return res.status(400).json(responseData)
  }
  const userIndex = userList.findIndex(user => user.id === parseInt(result.data.id))
  if (userIndex === -1) {
    responseData.message = `No se encontro el usuario id ${result.data.id}`
    responseData.data = null
    responseData.success = false
    return res.status(400).json(responseData)
  }

  userList[userIndex] = result.data
  responseData.data = result.data
  responseData.message = 'Registro gurdado'
  res.json(responseData)
})

// Si la url no es captura por ninguno de los metos anteriores llegaria a este metodo que captura todo
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
