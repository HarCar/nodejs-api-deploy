import { FrontendRepository } from "../repositories/FrontendRepository.js"
import Constants from "../tools/Constants.js"
import path from "node:path"
import Helpers from "../tools/Helpers.js"
import { BaseController } from "./BaseController.js"

export class FrontendController {
	static async home(req, res, next) {
		try {
			const sessionData = await BaseController.GetSessionData(req)
			const company = sessionData?.company ?? null
			const userGroup = sessionData.userGroup ?? null

			if (sessionData == null) {
				return res.redirect("/Authentication")
			} else if (company === null) {
				return res.redirect("/Authentication/SelectCompany")
			} else if (userGroup === null) {
				return res.redirect("/Authentication/SelectUsersGroups")
			} else {
				res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
			}
		} catch (error) {
			next(error)
		}
	}

	static async list(req, res, next) {
		console.log("list")
		try {
			const { screen } = req.params
			const sessionData = await BaseController.GetSessionData(req)
			const company = sessionData?.company ?? null
			const userGroup = sessionData.userGroup ?? null

			if (Helpers.isNull(sessionData)) {
				return res.redirect("/Authentication")
			}
			if (screen + "/Create" !== "Companies/Create" && Helpers.isNull(company)) {
				return res.redirect("/Authentication/SelectCompany")
			}
			if (screen + "/Create" !== "Companies/Create" && Helpers.isNull(userGroup)) {
				return res.redirect("/Authentication/SelectUsersGroups")
			}

			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async create(req, res, next) {
		console.log("create", req.session.data)

		try {
			const { screen } = req.params
			const sessionData = await BaseController.GetSessionData(req)
			const company = sessionData?.company ?? null
			const userGroup = sessionData.userGroup ?? null

			if (Helpers.isNull(sessionData)) {
				return res.redirect("/Authentication")
			}
			if (screen + "/Create" !== "Companies/Create" && Helpers.isNull(company)) {
				return res.redirect("/Authentication/SelectCompany")
			}
			if (screen + "/Create" !== "Companies/Create" && Helpers.isNull(userGroup)) {
				return res.redirect("/Authentication/SelectUsersGroups")
			}

			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async createCompany(req, res, next) {
		console.log("createCompany", req.session.data.uid)

		try {
			const uid = req?.session?.data?.uid
			if (Helpers.isNullOrEmpty(uid)) {
				return res.redirect("/Authentication")
			}

			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async dataScreen(req, res, next) {
		try {
			const { screen } = req.params
			const sessionData = await BaseController.GetSessionData(req)
			const company = sessionData?.company ?? null
			const userGroup = sessionData.userGroup ?? null

			if (Helpers.isNull(sessionData)) {
				res.send({ success: true, redirect: true, url: "/Authentication" })
				return
			}
			if (screen + "/Create" !== "Companies/Create" && Helpers.isNull(company)) {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectCompany" })
				return
			}
			if (screen + "/Create" !== "Companies/Create" && Helpers.isNull(userGroup)) {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectUsersGroups" })
				return
			}

			const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
			const frontendRepository = new FrontendRepository({
				context:
					company == null ? req.context.db("IsavConfig") : req.context.db(sessionData.company.CompanyID.toString()),
				contextConfig: req.context.db("IsavConfig"),
				entity: screen,
				languageCode,
				sessionData: sessionData,
			})

			const data = await frontendRepository.getDataScreen({ entity: screen })
			res.send({ success: true, data })
		} catch (error) {
			next(error)
		}
	}

	static async getFieldsProperties(req, res, next) {
		const { context } = FrontendRepository.getContexts(req)

		try {
			const data = context.collection(Constants.ENTITY_FIELDS_PROPERTIES).find({}).toArray()

			res.json({
				success: true,
				message: null,
				data,
			})
		} catch (error) {
			next(error)
		}
	}
}
