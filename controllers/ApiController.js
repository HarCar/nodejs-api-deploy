import { SessionData } from "../SessionData.js"
import { BaseRepository } from "../repositories/BaseRepository.js"
import { CompaniesRepository } from "../repositories/CompaniesRepository.js"
import t from "../resources.js"
import jwt from "jsonwebtoken"
import { BaseController } from "./BaseController.js"
import {
	CreateUserWithEmailAndPassword,
	SendPasswordResetEmail,
	SignInWithEmailAndPassword,
	SetMessageByErrorCode,
} from "../tools/authenticationFirebase.js"
import path from "node:path"
import Helpers from "../tools/Helpers.js"

export class ApiController {
	static async get(req, res, next) {
		const { screen } = req.params
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({ context, contextConfig, languageCode, entity: screen, sessionData: null })

		try {
			let data = null
			const { Screens } = req.query

			if (screen === "screens") {
				data = await repository.getScreens()
			} else if (screen === "FieldsProperties" && Screens === "Companies") {
				data = await repository.getFieldsPropertiesForCompany()
			} else {
				data = await repository.get({ queryParams: req.query })
			}

			res.json({
				success: true,
				message: null,
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	static async find(req, res, next) {
		const { screen } = req.params
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({ context, contextConfig, languageCode, entity: screen, sessionData: null })

		try {
			const { id } = req.params
			const data = await repository.find({ id })

			res.json({
				success: true,
				message: data === null ? `No se encontro registro con id = ${id}` : null,
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	static async findByName(req, res, next) {
		const { screen } = req.params
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({ context, contextConfig, languageCode, entity: screen, sessionData: null })

		try {
			const { name } = req.params
			const data = await repository.findByName({ name })

			res.json({
				success: true,
				message: data === null ? `No se encontro registro con nombre = ${name}` : null,
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	static async saveCompany(req, res, next) {
		console.log("saveCompany")
		const contextConfig = req.context.db("IsavConfig")
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"

		try {
			if (Array.isArray(req.body)) {
				throw new Error("No puedes crear mas de una empresa al mismo tiempo")
			}

			const companiesRepository = new CompaniesRepository({
				context: null,
				contextConfig,
				languageCode,
				entity: "Companies",
				sessionData: BaseController.GetSessionData(req),
			})
			const data = await companiesRepository.insert({ objet: req.body })
			companiesRepository["_context"] = req.context.db(data._id.toString())
			companiesRepository.completeSetup({ company: data })

			res.json({
				success: true,
				message: "Registro gurdado",
				data,
				redirect: true,
				url: "/Authentication/SelectCompany",
			})
		} catch (error) {
			next(error)
		}
	}

	static async post(req, res, next) {
		const { screen } = req.params
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({
			context,
			contextConfig,
			languageCode,
			entity: screen,
			sessionData: await BaseController.GetSessionData(req),
		})
		try {
			if (screen === "Companies" && Array.isArray(req.body)) {
				throw new Error("No puedes crear mas de una empresa al mismo tiempo")
			}

			const data = await repository.insert({ objet: req.body })

			let redirect = false
			let url = ""

			if (screen === "Companies") {
				const companiesRepository = new CompaniesRepository({
					context: req.context.db(data._id),
					contextConfig,
					languageCode,
					entity: "Companies",
					sessionData: BaseController.GetSessionData(req),
				})
				await companiesRepository.completeSetup({ company: data })
				redirect = true
				url = "/Authentication/SelectCompany"
			}

			res.json({
				success: true,
				message: "Registro gurdado",
				data,
				redirect,
				url,
			})
		} catch (error) {
			next(error)
		}
	}

	static async patch(req, res, next) {
		const { screen } = req.params
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({ context, contextConfig, languageCode, entity: screen, sessionData: null })

		try {
			const { id } = req.params

			const result = await repository.update({ id, objet: req.body })

			res.json({
				success: true,
				message: result.modifiedCount > 0 ? "Registro gurdado" : "",
				modifiedCount: result.modifiedCount,
			})
		} catch (error) {
			next(error)
		}
	}

	static async delete(req, res, next) {
		const { screen } = req.params
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({ context, contextConfig, languageCode, entity: screen, sessionData: null })

		try {
			const { id } = req.params
			const result = await repository.delete({ id })

			res.json({
				success: true,
				message: result.deletedCount > 0 ? "Registro borrado" : "",
				deletedCount: result.deletedCount,
			})
		} catch (error) {
			next(error)
		}
	}

	static async renameProperty(req, res) {
		const { entity, oldFieldName, newFieldName } = req.query

		const context = req.context.db("665879473f24fc739eacea86")
		const contextConfig = req.context.db("IsavConfig")

		const updateObject = { $rename: {} }
		updateObject.$rename[oldFieldName] = newFieldName

		let dbCollection = context.collection(entity)
		const result1 = await dbCollection.updateMany({}, updateObject)

		dbCollection = contextConfig.collection(entity)
		const result2 = await dbCollection.updateMany({}, updateObject)

		res.json({
			success: true,
			data: { result1, result2 },
		})
	}

	// Authentication
	static async usersCompanies(req, res, next) {
		const { context, contextConfig } = BaseController.getContexts(req)
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const repository = new BaseRepository({
			context,
			contextConfig,
			languageCode,
			entity: "Users_Companies",
			sessionData: null,
		})

		try {
			const sessionData = BaseController.GetSessionData(req)
			const data = await repository.get({ queryParams: { uid: sessionData.uid } })

			res.json({
				success: true,
				message: null,
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	static async signInSignUp(req, res, next) {
		console.log("SignInSignUp")
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async selectCompany(req, res, next) {
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async setCompany(req, res, next) {
		try {
			const response = { success: true }
			const { ID } = req.params
			const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
			const contextConfig = req.context.db("IsavConfig")
			const context = req.context.db(ID)
			const sessionData = BaseController.GetSessionData(req)

			let baseRepository = new BaseRepository({
				context,
				contextConfig,
				languageCode,
				entity: "Companies",
				sessionData: sessionData,
			})
			const company = await baseRepository.find({ id: ID })
			sessionData.set(SessionData.propertyCompany, company)
			const uid = sessionData.uid

			baseRepository = new BaseRepository({
				context,
				contextConfig,
				languageCode,
				entity: "Users_Groups",
				sessionData: sessionData,
			})
			const usersGroups = await baseRepository.get({ queryParams: { uid } })
			if (usersGroups.length === 1) {
				sessionData.set(SessionData.propertyUserGroup, usersGroups[0])
				response.redirect = true
				response.url = "/"
			} else {
				response.redirect = true
				response.url = "/Authentication/SelectUsersGroups"
			}

			response.token = jwt.sign({ ...sessionData }, "tu_secreto", { expiresIn: "1h" })
			req.session.data = sessionData
			res.send(response)
		} catch (error) {
			next(error)
		}
	}

	static async createCompany(req, res, next) {
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async selectUsersGroups(req, res, next) {
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async signUp(req, res, next) {
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const { name, email, password } = req.body
		const context = req.context.db("IsavConfig")

		try {
			if (Helpers.isNullOrEmpty(name)) throw new Error(t(languageCode, "name") + " " + t(languageCode, "required"))
			if (Helpers.isNullOrEmpty(email)) throw new Error(t(languageCode, "email") + " " + t(languageCode, "required"))
			if (Helpers.isNullOrEmpty(password))
				throw new Error(t(languageCode, "password") + " " + t(languageCode, "required"))

			await CreateUserWithEmailAndPassword({ name, email, password })
			const collection = context.collection("Users")

			await collection.insertOne({ email, name })
			res.send({ success: true, message: `${t(languageCode, "verification_sent_to")} ${email}`, data: true })
		} catch (error) {
			SetMessageByErrorCode({ languageCode, error })
			next(error)
		}
	}

	static async signIn(req, res, next) {
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const { email, password, companyID, userGroupID } = req.body

		try {
			const response = {
				success: true,
			}
			if (Helpers.isNullOrEmpty(email)) throw new Error(t(languageCode, "email") + " " + t(languageCode, "required"))
			if (Helpers.isNullOrEmpty(password))
				throw new Error(t(languageCode, "password") + " " + t(languageCode, "required"))

			const result = await SignInWithEmailAndPassword(email, password)
			const sessionData = new SessionData()
			if (result.userCredential.user.emailVerified) {
				sessionData.set(SessionData.propertyEmailVerified, result.userCredential.user.emailVerified)
				sessionData.set(SessionData.propertyEmail, result.userCredential.user.email)
				sessionData.set(SessionData.propertyUid, result.userCredential.user.uid)

				const contextConfig = req.context.db("IsavConfig")
				let baseRepository = new BaseRepository({
					context: null,
					contextConfig,
					languageCode,
					entity: "Users_Companies",
					sessionData: sessionData,
				})
				let userCompanies = await baseRepository.get({
					queryParams: { uid: sessionData.get(SessionData.propertyUid) },
				})

				if (!Helpers.isNullOrEmpty(companyID) && Helpers.any(userCompanies)) {
					userCompanies = userCompanies.filter((map) => map.CompanyID.toString() === companyID)
				}

				if (!Helpers.any(userCompanies)) {
					throw new Error(`No se encontro la emprea con ID ${companyID}`)
				}

				if (userCompanies.length === 1) {
					sessionData.set(SessionData.propertyCompany, userCompanies[0])
					baseRepository = new BaseRepository({
						context: req.context.db(userCompanies[0].CompanyID.toString()),
						contextConfig,
						languageCode,
						entity: "Users_Groups",
						sessionData: sessionData,
					})

					let usersGroups = await baseRepository.get({ queryParams: null })

					if (!Helpers.isNullOrEmpty(userGroupID) && Helpers.any(usersGroups)) {
						usersGroups = usersGroups.filter((map) => map.UserGroupID.toString() === userGroupID)
					}
					if (!Helpers.any(usersGroups)) {
						throw new Error(`No se encontro la grupo de usuario con ID ${userGroupID}`)
					}

					if (usersGroups.length === 1) {
						sessionData.set(SessionData.propertyUserGroup, usersGroups[0])
						response.redirect = true
						response.url = "/"
					} else {
						response.redirect = true
						response.url = "/Authentication/SelectUsersGroups"
					}
				} else {
					response.redirect = true
					response.url = "/Authentication/SelectCompany"
				}
			} else {
				response.message = `${t(languageCode, "verification_sent_to")} ${email}`
			}

			response.token = jwt.sign({ ...sessionData }, "tu_secreto", { expiresIn: "1h" })
			req.session.data = sessionData
			res.send(response)
		} catch (error) {
			SetMessageByErrorCode({ languageCode, error })
			next(error)
		}
	}

	static async passwordReset(req, res, next) {
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const { email } = req.body

		try {
			if (Helpers.isNullOrEmpty(email)) throw new Error(t(languageCode, "email") + " " + t(languageCode, "required"))

			await SendPasswordResetEmail({ email })
			res.send({ success: true, message: t(languageCode, "password_reset_email_sent") })
		} catch (error) {
			SetMessageByErrorCode({ languageCode, error })

			next(error)
		}
	}

	static async signOut(req, res) {
		console.log("SignOut")
		const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
		const session = req.session
		if (session) {
			session.destroy(async (error) => {
				if (error) {
					const message = t(languageCode, "logout_error")
					res.send({ success: false, message: message.toString() + " " + error.message })
					console.error("Error al cerrar la sesión:", error)
				} else {
					res.json({
						success: true,
						message: "Registro gurdado",
						redirect: true,
						url: "/Authentication",
					})
				}
			})
		}
	}

	static async test(req, res, next) {
		try {
			const sessionData = await BaseController.GetSessionData(req)
			res.send(sessionData)
		} catch (error) {
			next(error)
		}
	}

	static async backupRemote() {
		require("dotenv").config()
		const { exec } = require("child_process")
		const { REMOTE_URI, BACKUP_PATH } = process.env

		const exportCommand = `mongodump --uri="${REMOTE_URI}" --out="${BACKUP_PATH}"`

		exec(exportCommand, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error al exportar la base de datos: ${error.message}`)
				return
			}
			if (stderr) {
				console.error(`Error en el proceso de exportación: ${stderr}`)
				return
			}
			console.log(`Exportación completada: ${stdout}`)
		})
	}
}
