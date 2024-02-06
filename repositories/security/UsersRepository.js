import { StringValidation } from '../../tools/FieldsValidation.js'

export class SecurityBaseRepository {
  constructor ({ name, email, languageCode }) {
    this._Name = name
    this._Email = email
    this._LanguageCode = languageCode
  }

  FieldsValidation = async ({ field }) => {
    let value = ''
    switch (field) {
      case 'name':
        value = this._Name === undefined ? '' : this._Name
        break
      case 'email':
        value = this._Email === undefined ? '' : this._Email
        break
    }
    await StringValidation({
      languageCode: this._LanguageCode,
      field,
      value,
      required: true
    })
  }
}
