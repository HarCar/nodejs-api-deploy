import { SessionData } from "../SessionData.js"
import { BaseRepository } from "../repositories/BaseRepository.js"
import { CompaniesRepository } from "../repositories/CompaniesRepository.js"
import t from "../resources.js"
import jwt from "jsonwebtoken"
import { promisify } from "util"

import {
	CreateUserWithEmailAndPassword,
	SendPasswordResetEmail,
	SignInWithEmailAndPassword,
	SetMessageByErrorCode,
} from "../tools/authenticationFirebase.js"
import path from "node:path"
import Helpers from "../tools/Helpers.js"
const verifyAsync = promisify(jwt.verify)

export class BaseController {
	static async ValidateSession(req, res, next) {
		const sessionData = await BaseController.GetSessionData(req)
		if (Helpers.isNull(sessionData)) {
			const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
			return res.status(401).send({ success: false, message: t(languageCode, "invalidOrExpiredSession") })

			// return res.redirect("/login")
		} else {
			next()
		}
	}

	static async GetSessionData(req) {
		const authHeader = req.headers["authorization"]
		const token = authHeader && authHeader.split(" ")[1]
		let session = req.session.data
		if (!Helpers.isNull(token) && Helpers.isNull(session)) {
			try {
				session = await verifyAsync(token, "tu_secreto")
			} catch (e) {
				console.log(e)
			}
		}

		if (Helpers.isNull(session)) {
			return null
		}

		const sessionData = new SessionData()
		sessionData.set(SessionData.propertyEmailVerified, session.emailVerified)
		sessionData.set(SessionData.propertyEmail, session.email)
		sessionData.set(SessionData.propertyUid, session.uid)
		sessionData.set(SessionData.propertyLastLoginDateTime, session.lastLoginDateTime)
		sessionData.set(SessionData.propertyViews, session.views)
		sessionData.set(SessionData.propertyCompany, session.company)
		sessionData.set(SessionData.propertyUserGroup, session.userGroup)

		return sessionData
	}

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
				sessionData: req.session.data,
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
					sessionData: req.session.data,
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

	static getContexts(req) {
		// OJO Temporal
		return { context: req.context.db("665879473f24fc739eacea86"), contextConfig: req.context.db("IsavConfig") }

		// if (Helpers.isNull(req.session.data)) { return { context: req.context.db('IsavConfig'), contextConfig: null } }

		// if (Helpers.isNull(req.session.data)) { return { context: req.context.db('IsavConfig'), contextConfig: null } }

		// if (Helpers.isNull(req.session.data.company)) { return { context: req.context.db('IsavConfig'), contextConfig: null } }

		// return { context: req.context.db(req.session.data.company.CompanyID.toString()), contextConfig: req.context.db('IsavConfig') }
	}

	// Authentication
	static async UsersCompanies(req, res, next) {
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
			const data = await repository.get({ queryParams: { uid: req.session.data.uid } })

			res.json({
				success: true,
				message: null,
				data,
			})
		} catch (error) {
			next(error)
		}
	}

	static async SignInSignUp(req, res, next) {
		console.log("SignInSignUp")
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async SelectCompany(req, res, next) {
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async SetCompany(req, res, next) {
		try {
			const { ID } = req.params
			const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
			const contextConfig = req.context.db("IsavConfig")
			const context = req.context.db(ID)
			let baseRepository = new BaseRepository({
				context,
				contextConfig,
				languageCode,
				entity: "Companies",
				sessionData: req.session.data,
			})
			const company = await baseRepository.find({ id: ID })

			req.session.data.company = company
			const uid = req.session.data.uid

			baseRepository = new BaseRepository({
				context,
				contextConfig,
				languageCode,
				entity: "Users_Groups",
				sessionData: req.session.data,
			})
			const usersGroups = await baseRepository.get({ queryParams: { uid } })
			if (usersGroups.length === 1) {
				req.session.data.userGroup = usersGroups[0]
				res.send({ success: true, redirect: true, url: "/" })
			} else {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectUsersGroups" })
			}
		} catch (error) {
			next(error)
		}
	}

	static async CreateCompany(req, res, next) {
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async SelectUsersGroups(req, res, next) {
		try {
			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async SignUp(req, res, next) {
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

	static async SignIn(req, res, next) {
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

	static async PasswordReset(req, res, next) {
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

	static async SignOut(req, res) {
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

	static async Test(req, res, next) {
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
