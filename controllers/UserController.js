import { UserModel } from '../models/UsersModel.js'

export class UserController {
  static async get (req, res, next) {
    try {
      res.header('Access-Control-Allow-Origin', '*')
      const { rol, age } = req.query

      const data = await UserModel.get({ name: null, email: null, rol, age })
      res.json({
        success: true,
        message: null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async find (req, res, next) {
    try {
      const { id } = req.params
      const data = await UserModel.find({ id })

      res.json({
        success: true,
        message: data === null ? `No se encontro el usuario con id = ${id}` : null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async post (req, res, next) {
    try {
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
    } catch (error) {
      next(error)
    }
  }

  static async patch (req, res, next) {
    try {
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
    } catch (error) {
      next(error)
    }
  }

  static async delete (req, res, next) {
    try {
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
    } catch (error) {
      next(error)
    }
  }
}
