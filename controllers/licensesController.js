import { licensesModel } from '../models/licensesModel.js'

export class LicensesController {
  static async get (req, res, next) {
    try {
      res.header('Access-Control-Allow-Origin', '*')
      const { rol, age } = req.query

      const data = await licensesModel.get({ name: null, email: null, rol, age })
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
      const data = await licensesModel.find({ id })

      res.json({
        success: true,
        message: data === null ? `No se encontro registro con id = ${id}` : null,
        data
      })
    } catch (error) {
      next(error)
    }
  }

  static async post (req, res, next) {
    try {
      const result = await licensesModel.insert({ objet: req.body })
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

      const result = await licensesModel.update({ id, objet: req.body })
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

      const result = await licensesModel.deleteOne({ id })
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
