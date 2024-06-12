import Constants from "../tools/Constants.js"

const FieldsProperties = async ({ context }) => {
	const fieldsProperties = await context.collection(Constants.ENTITY_FIELDS_PROPERTIES).find({}).toArray()

	return fieldsProperties
}

export default FieldsProperties
