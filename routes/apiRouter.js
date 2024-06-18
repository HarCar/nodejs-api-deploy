import { Router } from "express"
import { BaseController } from "../controllers/BaseController.js"
import Helpers from "../tools/Helpers.js"

export const apiRouter = Router()

apiRouter.get("/SessionData", async (req, res, next) => {
	const sessionData = BaseController.GetSessionData(req)
	if (!Helpers.isNull(sessionData)) {
		const data = sessionData
		data["actions"] = await BaseController.getMenu(req, next)
		res.json({
			success: true,
			message: null,
			data: data,
		})
	} else {
		res.json({
			success: true,
			message: null,
			actions: await BaseController.getMenu(req, next),
			data: null,
		})
	}
})
apiRouter.get("/RenameProperty", BaseController.renameProperty)
apiRouter.post("/SignUp", BaseController.SignUp)
apiRouter.post("/SignIn", BaseController.SignIn)
apiRouter.post("/PsasswordReset", BaseController.PasswordReset)
apiRouter.post("/SignOut", BaseController.SignOut)
apiRouter.post("/SelectCompany/:ID", BaseController.SetCompany)
apiRouter.get("/Companies", BaseController.ValidateSession, BaseController.UsersCompanies)
apiRouter.get("/Test", BaseController.ValidateSession, BaseController.Test)

apiRouter.post("/Companies", BaseController.saveCompany)
apiRouter.get("/:screen/:id", BaseController.find)
apiRouter.get("/:screen/name/:name", BaseController.findByName)
apiRouter.get("/:screen", BaseController.ValidateSession, BaseController.get)
apiRouter.post("/:screen", BaseController.post)
apiRouter.patch("/:screen/:id", BaseController.patch)
apiRouter.delete("/:screen/:id", BaseController.delete)

apiRouter.get("/", (req, res) => {
	res.send("¡Bienvenido API v: 1.1.11")
})
