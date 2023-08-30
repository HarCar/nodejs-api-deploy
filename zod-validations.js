const zod = require('zod')

const userSchema = zod.object({
  id: zod.number({
    invalid_type_error: 'El campo id no es valido',
    required_error: 'El campo id no es requerido'
  }).int().positive(),
  name: zod.string({
    invalid_type_error: 'El campo nombre no es valido',
    required_error: 'El campo name no es requerido'
  }),
  email: zod.string({
    invalid_type_error: 'El campo amail no es valido',
    required_error: 'El campo email no es requerido'
  }),
  rol: zod.enum(['admin', 'Usuario', 'Editor'], {
    invalid_enum_value_error: 'El campo rol no es valido',
    required_error: 'El campo rol no es requerido'
  }),
  age: zod.number({
    invalid_type_error: 'El campo age no es valido',
    required_error: 'El campo age no es requerido'
  }).int().positive().min(1).max(200)
})

function ValidateUser (object) {
  return userSchema.safeParse(object)
}

function ValidatePartialUser (object) {
  return userSchema.partial().safeParse(object)
}

module.exports = {
  ValidateUser,
  ValidatePartialUser
}
