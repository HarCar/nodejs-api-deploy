export const ValidateSchemePartial = ({ objet, scheme }) => {
  const result = scheme.partial().safeParse(objet)

  if (result.success) {
    return { success: result.success, data: result.data }
  } else {
    const message = result.error.errors.map(error => error.message).join(', ')
    return { success: result.success, message }
  }
}
