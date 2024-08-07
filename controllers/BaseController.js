import { SessionData } from "../SessionData.js"
import t from "../resources.js"
import jwt from "jsonwebtoken"
import { promisify } from "util"

import Helpers from "../tools/Helpers.js"
const verifyAsync = promisify(jwt.verify)

export class BaseController {
	static async validateSession(req, res, next) {
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
		console.log(req.originalUrl, "GetSessionData", session)
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
		sessionData.set(SessionData.propertyName, session.name)
		sessionData.set(SessionData.propertyUid, session.uid)
		sessionData.set(SessionData.propertyCompany, session.company)
		sessionData.set(SessionData.propertyUserGroup, session.userGroup)

		return sessionData
	}

	static getContexts(req, sessionData) {
		if (Helpers.isNull(sessionData)) {
			return { context: null, contextConfig: req.context.db("IsavConfig") }
		}

		if (Helpers.isNull(sessionData.company)) {
			return { context: null, contextConfig: req.context.db("IsavConfig") }
		}

		return {
			context: req.context.db(sessionData.company._id.toString()),
			contextConfig: req.context.db("IsavConfig"),
		}
	}
}
