import { Router } from "express"
import { BaseController } from "../controllers/BaseController.js"

export const apiRouter = Router()

apiRouter.get("/SessionData", async (req, res, next) => {
	if (req.session.data) {
		const data = req.session.data.sessionData
		data["actions"] = await BaseController.getMenu(req, next)
		res.json({
			success: true,
			message: null,
			data: data,
		})
	} else {
		// res.json(false)
		// OJO temporal
		const sd = {
			success: true,
			message: null,
			actions: [
				{
					_id: "6663946aeb952b343caa1437",
					SectionID: "665b7a27d0bf2c5c0ef9d714",
					Name: "Customers",
					Caption_es: "Clientes",
					Caption_en: "Customers",
					ModuleID: "666393cdeb952b343caa1435",
					SectionName: "Datos maestros",
					ModuleName: "Ventas",
				},
			],
			data: {
				emailVerified: true,
				email: "harvycardoza@gmail.com",
				uid: "gX22oZ8moHMQdbUxCLFfafDPPsd2",
				lastLoginDateTime: "2024-06-06T22:50:01.437Z",
				company: {
					_id: "6660fb65abf6f41332b09409",
					Name: "Borrar empresa",
					CountryID: "6653bcf2d0d47d4c0bdfd033",
					CountryName: "Costa Rica",
				},
				companyID: "6660fb65abf6f41332b09409",
				userGroup: {
					_id: "6660fb65abf6f41332b0940c",
					UserGroupID: {
						acknowledged: true,
						insertedId: "6660fb65abf6f41332b0940b",
					},
					uid: "gX22oZ8moHMQdbUxCLFfafDPPsd2",
				},
			},
		}

		res.json({
			success: true,
			message: null,
			actions: await BaseController.getMenu(req, next),
			data: sd,
		})
	}
})
apiRouter.get("/RenameProperty", BaseController.renameProperty)
apiRouter.post("/SignUp", BaseController.SignUp)
apiRouter.post("/SignIn", BaseController.SignIn)
apiRouter.post("/PsasswordReset", BaseController.PasswordReset)
apiRouter.post("/SignOut", BaseController.SignOut)
apiRouter.post("/SelectCompany/:ID", BaseController.SetCompany)
apiRouter.get("/Test", BaseController.Test)

apiRouter.get("/:screen/:id", BaseController.find)
apiRouter.get("/:screen/name/:name", BaseController.findByName)
apiRouter.get("/:screen", BaseController.get)
apiRouter.post("/:screen", BaseController.post)
apiRouter.patch("/:screen/:id", BaseController.patch)
apiRouter.delete("/:screen/:id", BaseController.delete)

apiRouter.get("/", (req, res) => {
	res.send("¡Bienvenido API v: 1.1.11")
})
