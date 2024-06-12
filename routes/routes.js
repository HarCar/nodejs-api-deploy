import { authenticationRouters } from "./authenticationRouters.js"
import { apiRouter } from "./apiRouter.js"
import cors from "cors"
import { frontendRouters } from "./frontendRouters.js"

export class Routes {
	constructor(app) {
		console.log("Create Routes")
		this._app = app
	}

	Set = () => {
		console.log("Set Routes")

		// Configurar CORS
		const corsOptions = {
			origin: "*", // Cambia esto por el dominio de tu aplicación en producción
			methods: ["GET", "POST", "PATCH", "DELETE"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}

		this._app.use(cors(corsOptions))
		this._app.options("*", cors(corsOptions))

		// // Authentication
		this._app.use("/Authentication", authenticationRouters)

		// API
		this._app.options("api/", (req, res) => {
			res.header("Access-Control-Allow-Origin", "*") // Todo manejar por dominio para no permitir de todo lado
			res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
			res.send(200)
		})
		this._app.use("/api", apiRouter)

		// Frontend
		this._app.use("/", frontendRouters)
	}
}
