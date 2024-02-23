import { z } from 'zod'
import { getResource } from '../resources/getResource.js'
export class CustomScheme {
  constructor ({ languageCode }) {
    this._languageCode = languageCode
  }

  async getName () {
    return z.string({
      invalid_type_error: await getResource({ languageCode: this._languageCode, field: 'name', text: 'invalid' }),
      required_error: await getResource({ languageCode: this._languageCode, field: 'name', text: 'required' })
    })
      .min(3, { message: await getResource({ languageCode: this._languageCode, field: 'name', text: 'min' }) })
      .max(50, { message: await getResource({ languageCode: this._languageCode, field: 'name', text: 'max' }) })
  }

  async getEmail () {
    return z.string({
      invalid_type_error: await getResource({ languageCode: this._languageCode, field: 'email', text: 'invalid' }),
      required_error: await getResource({ languageCode: this._languageCode, field: 'email', text: 'required' })
    })
      .email({ message: await getResource({ languageCode: this._languageCode, field: 'email', text: 'invalid' }) })
  }

  async getRol () {
    return z.enum(['Admin', 'User'], {
      invalid_type_error: await getResource({ languageCode: this._languageCode, field: 'rol', text: 'invalid' }),
      required_error: await getResource({ languageCode: this._languageCode, field: 'rol', text: 'required' })
    })
  }

  async getAge () {
    return z.number({
      invalid_type_error: await getResource({ languageCode: this._languageCode, field: 'age', text: 'invalid' }),
      required_error: await getResource({ languageCode: this._languageCode, field: 'age', text: 'required' })
    })
      .min(1, { message: await getResource({ languageCode: this._languageCode, field: 'age', text: 'min' }) })
      .max(200, { message: await getResource({ languageCode: this._languageCode, field: 'age', text: 'max' }) }).optional()
  }

  async getInactive () {
    return z.boolean({
      invalid_type_error: await getResource({ languageCode: this._languageCode, field: 'inactive', text: 'invalid' }),
      required_error: await getResource({ languageCode: this._languageCode, field: 'inactive', text: 'required' })
    })
  }
}
