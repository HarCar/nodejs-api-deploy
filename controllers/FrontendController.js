import { FrontendRepository } from "../repositories/FrontendRepository.js"
import Constants from "../tools/Constants.js"
import path from "node:path"

export class FrontendController {
	static async home(req, res, next) {
		try {
			const sessionData = req?.session?.data?.sessionData ?? null
			const company = req?.session?.data?.sessionData?.company ?? null
			const userGroup = req?.session?.data?.sessionData?.userGroup ?? null

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

			if (
				req.session.data === undefined ||
				req.session.data.sessionData === undefined ||
				req.session.data.sessionData == null
			) {
				return res.redirect("/Authentication")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.sessionData.company === undefined || req.session.data.sessionData.company === null)
			) {
				return res.redirect("/Authentication/SelectCompany")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.sessionData.userGroup === undefined || req.session.data.sessionData.userGroup === null)
			) {
				return res.redirect("/Authentication/SelectUsersGroups")
			}

			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async create(req, res, next) {
		try {
			const { screen } = req.params

			if (
				req.session.data === undefined ||
				req.session.data.sessionData === undefined ||
				req.session.data.sessionData == null
			) {
				return res.redirect("/Authentication")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.sessionData.company === undefined || req.session.data.sessionData.company === null)
			) {
				return res.redirect("/Authentication/SelectCompany")
			}
			if (
				screen + "/Create" !== "Companies/Create" &&
				(req.session.data.sessionData.userGroup === undefined || req.session.data.sessionData.userGroup === null)
			) {
				return res.redirect("/Authentication/SelectUsersGroups")
			}

			res.sendFile(path.join(path.resolve(), "views", "dist", "index.html"))
		} catch (error) {
			next(error)
		}
	}

	static async dataScreen(req, res, next) {
		// OJO temporal
		req.session.data = {
			sessionData: {
				// OJO temporal
				emailVerified: true,
				email: "harvycardoza@gmail.com",
				uid: "gX22oZ8moHMQdbUxCLFfafDPPsd2",
				lastLoginDateTime: new Date().toISOString(),
				company: {
					_id: "665879473f24fc739eacea86",
					Name: "Test",
					CountryID: "6653bd0cd0d47d4c0bdfd0a3",
				},
				userGroup: {
					_id: "665879473f24fc739eacea89",
					UserGroupID: {
						acknowledged: true,
						insertedId: "665879473f24fc739eacea88",
					},
					uid: "gX22oZ8moHMQdbUxCLFfafDPPsd2",
				},
			},
		}

		try {
			const { screen } = req.params
			const sessionData = req?.session?.data?.sessionData ?? null
			const company = req?.session?.data?.sessionData?.company ?? null
			const userGroup = req?.session?.data?.sessionData?.userGroup ?? null

			if (sessionData === null) {
				res.send({ success: true, redirect: true, url: "/Authentication" })
				return
			}
			if (screen + "/Create" !== "Companies/Create" && company === null) {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectCompany" })
				return
			}
			if (userGroup === null) {
				res.send({ success: true, redirect: true, url: "/Authentication/SelectUsersGroups" })
				return
			}

			const languageCode = req.language !== undefined && req.language.code === "en" ? "en" : "es"
			const frontendRepository = new FrontendRepository({
				context: req.context.db(req.session.data.sessionData.company._id.toString()),
				contextConfig: null,
				entity: screen,
				languageCode,
				sessionData: req.session.data.sessionData,
			})

			const data = await frontendRepository.getDataScreen({ entity: screen, id: "665b7abad0bf2c5c0ef9d715" })
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
