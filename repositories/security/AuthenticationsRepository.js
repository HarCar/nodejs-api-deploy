import { SecurityBaseRepository } from './SecurityBaseRepository.js'
import { GetInvalidErrorMessage, GetResource } from '../../tools/FieldsValidation.js'

export class AuthenticationsRepository extends SecurityBaseRepository {
  constructor ({ userID, name, email, languageCode }) {
    super({ name, email, languageCode })
    this._UserID = userID
  }

  Validations = async ({ method }) => {
    if (method === 'SignUp') {
      await this.FieldsValidation({ field: 'name' })
    }
    await this.FieldsValidation({ field: 'email' })
  }

  SetMessageByErrorCode = async ({ error }) => {
    let message

    switch (error.code) {
      case 'auth/weak-password':
        error.message = await GetResource({ languageCode: this._LanguageCode, field: 'password', text: 'invalid_length' })
        break
      case 'auth/invalid-email':
        message = await GetInvalidErrorMessage({ languageCode: this._LanguageCode, field: 'email' })
        error.message = message.replace('{0}', this._Email)
        break
      case 'auth/email-already-in-use':
        message = await GetResource({ languageCode: this._LanguageCode, field: 'authentication', text: 'email_already_in_use' })
        error.message = message
        break
      case 'auth/invalid-credential':
        message = await GetResource({ languageCode: this._LanguageCode, field: 'authentication', text: 'email_or_password_incorrect' })
        error.message = message
        break
    }
  }
}
