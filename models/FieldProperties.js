const FieldProperties = ({ fieldsProperties, fieldName }) => {
	try {
		const field = fieldsProperties.find((map) => map.Name === fieldName)
		return field
	} catch {
		throw new Error(`No se encontro la propiedad ${fieldName}`)
	}
}

export default FieldProperties
