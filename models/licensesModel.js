import zod from 'zod'
import { Contex } from './Context.js'

export const licensesModel = {
  get: async function ({ name, email, rol, age }) {
    const licenses = await Contex.Licenses.get()

    let dataFilter = licenses

    if (name) {
      dataFilter = dataFilter.filter(license => license.name === name)
    }

    if (email) {
      dataFilter = dataFilter.filter(license => license.email === email)
    }

    if (rol) {
      dataFilter = dataFilter.filter(license => license.rol === rol)
    }

    if (age) {
      dataFilter = dataFilter.filter(license => license.age === parseInt(age))
    }
    return dataFilter
  },
  find: async function ({ id }) {
    return await Contex.Licenses.find({ id })
  },
  insert: async function ({ objet }) {
    try {
      if (Array.isArray(objet)) {
        const records = []
        objet.forEach(record => {
          const result = licensesModel.Validate(record)

          if (result.error) { throw new Error(result.error.message) }
          records.push(result.data)
        })
        const insertResult = await Contex.Licenses.addRange({ records })
        return { data: records, insertResult }
      }

      const result = licensesModel.Validate(objet)
      if (result.error) { throw new Error(result.error.message) }

      const insertResult = await Contex.Licenses.add({ record: result.data })

      return { data: result.data, insertResult }
    } catch (error) {
      return { error: true, message: error.message }
    }
  },
  update: async function ({ id, objet }) {
    try {
      const result = licensesModel.ValidatePartial(objet)
      if (result.error) { throw new Error(result.error.message) }

      const currentobjet = await Contex.Licenses.find({ id })
      if (currentobjet == null) { throw new Error(`No se encontró el registro con id ${id}`) }

      const updateResult = await Contex.Licenses.update({ id, objet: result.data })

      return { data: result.data, updateResult }
    } catch (error) {
      return { error: true, message: error.message }
    }
  },
  deleteOne: async function ({ id }) {
    try {
      const currentobjet = await Contex.Licenses.find({ id })
      if (currentobjet == null) { throw new Error(`No se encontró el registro con id ${id}`) }

      const deleteResult = await Contex.Licenses.deleteOne({ id })

      return { data: deleteResult }
    } catch (error) {
      return { error: true, message: error.message }
    }
  },
  Schema: zod.object({
    name: zod.string({
      invalid_type_error: 'El campo nombre no es valido',
      required_error: 'El campo name es requerido'
    })
      .min(3, 'EL campo nombre debe tener al menos 3 caracteres')
      .max(50, 'EL campo nombre no debe tener mas 50 caracteres '),
    email: zod.string({
      invalid_type_error: 'El campo amail no es valido',
      required_error: 'El campo email es requerido'
    })
      .min(5, 'EL campo nombre debe tener al menos 5 caracteres')
      .max(50, 'EL campo nombre no debe tener mas 50 caracteres '),
    rol: zod.string()
      .refine(value => {
        const validRoles = ['Admin', 'Usuario', 'Editor']
        return validRoles.includes(value)
      }, {
        message: 'El valor rol válido, se esperaba: admin, Usuario, Editor'
      }),
    age: zod.number({
      invalid_type_error: 'El campo age no es valido',
      required_error: 'El campo age no es requerido'
    }).int().positive().min(1).max(200)
  }),
  Validate: (objet) => {
    return licensesModel.Schema.safeParse(objet)
  },
  ValidatePartial: (objet) => {
    return licensesModel.Schema.partial().safeParse(objet)
  }
}
