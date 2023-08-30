import { userModel } from '../models/usersModel.js'
import { ValidatePartialUser, ValidateUser } from '../zod-validations.js'

// Respuesta de api
const responseData = {
  success: true,
  data: null,
  message: ''
}

export class UserController {
  static async get (req, res) {
    res.header('Access-Control-Allow-Origin', '*')
    const { rol, age } = req.query

    responseData.message = null
    responseData.data = userModel.get({ name: null, email: null, rol, age })
    res.json(responseData)
  }

  static async find (req, res) {
    const { id } = req.params // Convertir a número
    const data = userModel.find({ id })

    responseData.data = data === undefined ? null : data
    responseData.message = data === undefined ? `No se encontro el usuario con id = ${id}` : null
    res.json(responseData)
  }

  static async post (req, res) {
    const result = ValidateUser(req.body)
    if (result.error) {
      responseData.message = JSON.parse(result.error.message)
      responseData.data = null
      responseData.success = false
      return res.status(400).json(responseData)
    }

    responseData.data = result.data
    userModel.insert(responseData.data)
    responseData.message = 'Registro gurdado'
    res.json(responseData)
  }

  static async patch (req, res) {
    const result = ValidatePartialUser(req.body)
    if (result.error) {
      responseData.message = JSON.parse(result.error.message)
      responseData.data = null
      responseData.success = false
      return res.status(400).json(responseData)
    }
    const { id } = req.params
    const record = userModel.update({ id: parseInt(id), objet: result.data })
    if (record === null) {
      responseData.message = `No se encontro el usuario id ${result.data.id}`
      responseData.data = null
      responseData.success = false
      return res.status(400).json(responseData)
    }

    responseData.data = result.data
    responseData.message = 'Registro gurdado'
    res.json(responseData)
  }
}
