import { getResource } from '../resources/getResource.js'
export const GetResource = async ({ languageCode, field, text }) => {
  return await getResource({
    languageCode,
    field,
    text
  })
}

export const GetInvalidErrorMessage = async ({ languageCode, field }) => {
  return await getResource({
    languageCode,
    field,
    text: 'invalid'
  })
}

export const StringValidation = async ({ languageCode, field, value, required }) => {
  if (value === undefined || value.trim() === '') {
    if (!required) { return '' }
    const message = await getResource({
      languageCode,
      field,
      text: 'required'
    })
    const error = new Error(message)
    error.status = 400
    error.error = 'Bad Request'
    error.message = message
    throw error
  }

  if (typeof value !== 'string') {
    if (!required) { return }

    const message = await getResource({
      languageCode,
      field,
      text: 'invalid'
    }).toString().replace('{0}', value)

    const error = new Error(message)
    error.status = 400
    error.error = 'Bad Request'
    error.message = message
    throw error
  }
}
