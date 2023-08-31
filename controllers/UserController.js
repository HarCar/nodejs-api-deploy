import { UserModel } from '../models/UsersModel.js'

export class UserController {
  static async get (req, res) {
    res.header('Access-Control-Allow-Origin', '*')
    const { rol, age } = req.query

    const data = await UserModel.get({ name: null, email: null, rol, age })
    res.json({
      success: true,
      message: null,
      data
    })
  }

  static async find (req, res) {
    const { id } = req.params // Convertir a número
    const data = await UserModel.find({ id })

    res.json({
      success: true,
      message: data === null ? `No se encontro el usuario con id = ${id}` : null,
      data
    })
  }

  static async post (req, res) {
    const result = await UserModel.insert({ objet: req.body })
    if (result.error) {
      const message = result.message
      return res.status(400).json({
        success: false,
        message,
        data: null
      })
    }

    const data = result.data
    res.json({
      success: true,
      message: 'Registro gurdado',
      data
    })
  }

  static async patch (req, res) {
    const { id } = req.params

    const result = await UserModel.update({ id, objet: req.body })
    if (result.error) {
      const message = result.message
      return res.status(400).json({
        success: false,
        message,
        data: null
      })
    }

    const data = result.data
    res.json({
      success: true,
      message: 'Registro gurdado',
      data
    })
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await UserModel.deleteOne({ id })
    if (result.error) {
      const message = result.message
      return res.status(400).json({
        success: false,
        message,
        data: null
      })
    }

    const data = result.data
    res.json({
      success: true,
      message: 'Registro borrado',
      data
    })
  }
}
