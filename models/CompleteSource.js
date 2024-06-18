import Helpers from "../tools/Helpers.js"
import Constants from "../tools/Constants.js"

const CompleteSource = async ({ context, data, languageCode }) => {
	if (Helpers.any(data)) {
		for (const i in data) {
			if (!Helpers.isNullOrEmpty(data[i][`Caption_${languageCode}`]))
				data[i]["Caption"] = data[i][`Caption_${languageCode}`]

			if (Helpers.isNullOrEmpty(data[i]["Source"]) && data[i]["Name"] === "Type") {
				data[i]["DataSource"] = [
					{ textValue: "Cadena de texto", value: "string" },
					{ textValue: "Identificador único", value: "ObjectId" },
					{ textValue: "Número", value: "number" },
					{ textValue: "Selección (Si/No)", value: "checkbox" },
					{ textValue: "Lista de texto", value: "stringList" },
					{ textValue: "Icono", value: "icon" },
				]
				continue
			}
			if (Helpers.isNullOrEmpty(data[i]["Source"]) && data[i]["Name"] === "CustomComponent") {
				data[i]["DataSource"] = [
					{ textValue: "Búsqueda desplegable", value: "DropdownSearch" },
					{ textValue: "Campo de Texto", value: "Input" },
					{ textValue: "Selección múltiple", value: "ListSelect" },
					{ textValue: "Selección simple", value: "SimpleSelect" },
				]
				continue
			}
			if (Helpers.isNullOrEmpty(data[i]["Source"]) && data[i]["Name"] === "Icon") {
				data[i]["DataSource"] = [
					{ textValue: "Datos maestros", value: "MasterData" },
					{ textValue: "Transacciones", value: "Transactions" },
					{ textValue: "Reportes", value: "Reports" },
					{ textValue: "Configuración", value: "Settings" },
				]
				continue
			}

			if (data[i]["Name"] === "Source") {
				const actions = await context.collection(Constants.ENTITY_ACTIONS).find({}).toArray()
				const actionsDataSource = []
				for (const a in actions) {
					actionsDataSource.push({
						textValue: actions[a][`Caption_${languageCode}`],
						value: actions[a].Name,
					})
				}
				data[i]["DataSource"] = actionsDataSource
				continue
			}
			if (Helpers.isNullOrEmpty(data[i]["Source"])) {
				continue
			}
			const entity = data[i]["Source"]

			const dataSource = await context.collection(entity).find({}).toArray()
			for (const s in dataSource) {
				dataSource[s].Selected = false

				if (!Helpers.isNullOrEmpty(dataSource[s][`Caption_${languageCode}`]))
					dataSource[s]["Caption"] = dataSource[s][`Caption_${languageCode}`]
			}
			data[i]["DataSource"] = dataSource
		}
	}

	return data
}

export default CompleteSource
