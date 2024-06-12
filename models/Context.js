import { MongoClient } from "mongodb"
import process from "node:process"
import session from "express-session"
import MongoDBStore from "connect-mongodb-session"
import Constants from "../tools/Constants.js"

const uri = process.env.URLDB ?? "mongodb://127.0.0.1:27017"
const uriSession = uri.replace("?retryWrites=true&w=majority", "IsavConfig?retryWrites=true&w=majority")

export function GetStore() {
	const MongoDBStoreSession = MongoDBStore(session)
	return new MongoDBStoreSession({
		uri: uriSession,
		collection: "SessionsData",
	})
}

export class Context {
	constructor() {
		this.client = new MongoClient(uri)
		this.connectedDatabase = false
	}

	async connect() {
		try {
			await this.client.connect()
			this.connectedDatabase = true
		} catch (error) {
			console.error("Error al conectar a la base de datos:", error)
		}
	}

	async closeConnection() {
		await this.client.close()
		this.connectedDatabase = false
		console.log("Conexión cerrada correctamente")
	}

	db(dataBaseName) {
		return this.client.db(dataBaseName)
	}

	async FieldsProperties({ dataBaseName, filters }) {
		const data = await this.client.db(dataBaseName).collection(Constants.FIELDS_PROPERTIES).find(filters).toArray()

		return data
	}
}
