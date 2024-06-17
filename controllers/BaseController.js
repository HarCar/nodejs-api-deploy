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
	static ValidateSession(req, res, next) {
		if (!req.session.data) {
			return res.redirect("/login")
		} else {
			next()
		}
	}

	static async GetSessionData(req) {
		// const session = req.session.data
		// 	? req.session.data.sessionData
		// 	: {
		// 			// OJO temporal
		// 			emailVerified: true,
		// 			email: "harvycardoza@gmail.com",
		// 			uid: "gX22oZ8moHMQdbUxCLFfafDPPsd2",
		// 			lastLoginDateTime: new Date().toISOString(),
		// 			company: {
		// 				_id: new ObjectId("665879473f24fc739eacea86"),
		// 				Name: "Test",
		// 				CountryID: new ObjectId("6653bd0cd0d47d4c0bdfd0a3"),
		// 			},
		// 			userGroup: {
		// 				_id: new ObjectId("665879473f24fc739eacea89"),
		// 				UserGroupID: {
		// 					acknowledged: true,
		// 					insertedId: new ObjectId("665879473f24fc739eacea88"),
		// 				},
		// 				uid: "gX22oZ8moHMQdbUxCLFfafDPPsd2",
		// 			},
		// 		}
		const authHeader = req.headers["authorization"]

		const token = authHeader && authHeader.split(" ")[1]
		console.log(token)
		let session = req.session.data
		if (token !== null) {
			try {
				session = await verifyAsync(token, "tu_secreto")
				console.log(session)
			} catch (e) {
				console.log(e)
			}
		}

		return token

		// const sessionData = new SessionData()
		// sessionData.set(SessionData.propertyEmailVerified, session.emailVerified)
		// sessionData.set(SessionData.propertyEmail, session.email)
		// sessionData.set(SessionData.propertyUid, session.uid)
		// sessionData.set(SessionData.propertyLastLoginDateTime, session.lastLoginDateTime)
		// sessionData.set(SessionData.propertyViews, session.views)
		// sessionData.set(SessionData.propertyCompany, session.company)
		// sessionData.set(SessionData.propertyUserGroup, session.userGroup)

		// return sessionData
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
					sessionData: req.session.data.sessionData,
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

		// if (Helpers.isNull(req.session.data.sessionData)) { return { context: req.context.db('IsavConfig'), contextConfig: null } }

		// if (Helpers.isNull(req.session.data.sessionData.company)) { return { context: req.context.db('IsavConfig'), contextConfig: null } }

		// return { context: req.context.db(req.session.data.sessionData.company._id.toString()), contextConfig: req.context.db('IsavConfig') }
	}

	// Authentication
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

			console.log(req.session.data)

			const contextConfig = req.context.db("IsavConfig")
			const context = req.context.db(ID)
			let baseRepository = new BaseRepository({
				context,
				contextConfig,
				languageCode,
				entity: "Companies",
				sessionData: req.session.data.sessionData,
			})
			const company = await baseRepository.find({ id: ID })

			req.session.data.sessionData.company = company
			req.session.data.sessionData.companyID = company._id.toString()
			const uid = req.session.data.sessionData.uid

			baseRepository = new BaseRepository({
				context,
				contextConfig,
				languageCode,
				entity: "Users_Groups",
				sessionData: req.session.data.sessionData,
			})
			const usersGroups = await baseRepository.get({ queryParams: { uid } })
			if (usersGroups.length === 1) {
				req.session.data.sessionData.userGroup = usersGroups[0]
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
		const { email, password } = req.body

		try {
			if (Helpers.isNullOrEmpty(email)) throw new Error(t(languageCode, "email") + " " + t(languageCode, "required"))
			if (Helpers.isNullOrEmpty(password))
				throw new Error(t(languageCode, "password") + " " + t(languageCode, "required"))

			const result = await SignInWithEmailAndPassword(email, password)

			if (result.userCredential.user.emailVerified) {
				req.session.data = new SessionData()
				req.session.data.set(SessionData.propertyEmailVerified, result.userCredential.user.emailVerified)
				req.session.data.set(SessionData.propertyEmail, result.userCredential.user.email)
				req.session.data.set(SessionData.propertyUid, result.userCredential.user.uid)
				req.session.data.set(SessionData.propertyLastLoginDateTime, new Date())

				console.log("req.session.data", req.session.data)

				const contextConfig = req.context.db("IsavConfig")
				const baseRepository = new BaseRepository({
					context: null,
					contextConfig,
					languageCode,
					entity: "Users_Companies",
					sessionData: req.session.data,
				})
				const userCompanies = await baseRepository.get({ queryParams: null })

				if (userCompanies.length === 1) {
					req.session.data.set(SessionData.propertyCompany, userCompanies[0])
					const usersGroups = await baseRepository.get({ queryParams: null, entity: "Users_Groups" })

					if (usersGroups.length === 1) {
						req.session.data.set(SessionData.propertyUserGroup, usersGroups[0])
						const token = jwt.sign(req.session.data, "tu_secreto", { expiresIn: "1h" })
						res.send({ success: true, redirect: true, url: "/", token })
					} else {
						const token = jwt.sign(req.session.data, "tu_secreto", { expiresIn: "1h" })
						res.send({ success: true, redirect: true, url: "/Authentication/SelectUsersGroups", token })
					}
				} else {
					const token = jwt.sign({ user: "Harvy", userID: 45 }, "tu_secreto", { expiresIn: "1h" })
					console.log(token)
					res.send({ success: true, redirect: true, url: "/Authentication/SelectCompany", token })
				}
			} else {
				res.send({ success: true, message: `${t(languageCode, "verification_sent_to")} ${email}` })
			}
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
		const sesion = req.session
		if (sesion) {
			sesion.destroy(async (error) => {
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
			console.log(req.session?.data?.sessionData)
			const sessionData = await BaseController.GetSessionData(req)
			res.send(sessionData)
		} catch (error) {
			next(error)
		}
	}

	// Aasas
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
