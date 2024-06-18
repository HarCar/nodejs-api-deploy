import { FrontendRepository } from "../repositories/FrontendRepository.js"
import Constants from "../tools/Constants.js"
import path from "node:path"
import Helpers from "../tools/Helpers.js"

export class FrontendController {
	static async home(req, res, next) {
		try {
			const sessionData = req?.session?.data ?? null
			const company = req?.session?.data?.company ?? null
			const userGroup = req?.session?.data?.userGroup ?? null

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

			if (req.session.data === undefined || req.session.data === undefined || req.session.data == null) {
				return res.redirect("/Authentication")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.company === undefined || req.session.data.company === null)
			) {
				return res.redirect("/Authentication/SelectCompany")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.userGroup === undefined || req.session.data.userGroup === null)
			) {
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

			if (req.session.data === undefined || req.session.data === undefined || req.session.data == null) {
				return res.redirect("/Authentication")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.company === undefined || req.session.data.company === null)
			) {
				return res.redirect("/Authentication/SelectCompany")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.userGroup === undefined || req.session.data.userGroup === null)
			) {
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
			const sessionData = req?.session?.data ?? null
			const company = req?.session?.data?.company ?? null
			const userGroup = req?.session?.data?.userGroup ?? null

			if (sessionData === null) {
				res.send({ success: true, redirect: true, url: "/Authentication" })
				return
			}
			if (screen + "/Create" !== "Companies/Create" && company === null) {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectCompany" })
				return
			}
			if (screen + "/Create" !== "Companies/Create" && userGroup === null) {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectUsersGroups" })
				return
			}

			const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
			const frontendRepository = new FrontendRepository({
				context:
					company == null
						? req.context.db("IsavConfig")
						: req.context.db(req.session.data.company.CompanyID.toString()),
				contextConfig: req.context.db("IsavConfig"),
				entity: screen,
				languageCode,
				sessionData: req.session.data,
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
