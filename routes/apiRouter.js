import { Router } from "express"
import { BaseController } from "../controllers/BaseController.js"
import { ApiController } from "../controllers/ApiController.js"

export const ApiRouter = Router()

ApiRouter.get("/Companies", BaseController.validateSession, ApiController.usersCompanies)
ApiRouter.get("/RenameProperty", BaseController.validateSession, ApiController.renameProperty)
ApiRouter.get("/Test", BaseController.validateSession, ApiController.test)
ApiRouter.get("/:screen/:id", ApiController.find)
ApiRouter.get("/:screen/name/:name", BaseController.validateSession, ApiController.findByName)
ApiRouter.get("/:screen", BaseController.validateSession, ApiController.get)

ApiRouter.post("/SignUp", ApiController.signUp)
ApiRouter.post("/SignIn", ApiController.signIn)
ApiRouter.post("/PasswordReset", BaseController.validateSession, ApiController.passwordReset)
ApiRouter.post("/SignOut", ApiController.signOut)
ApiRouter.post("/SelectCompany/:ID", BaseController.validateSession, ApiController.setCompany)
ApiRouter.post("/Companies", BaseController.validateSession, ApiController.saveCompany)
ApiRouter.post("/:screen", BaseController.validateSession, ApiController.post)

ApiRouter.patch("/:screen/:id", BaseController.validateSession, ApiController.patch)

ApiRouter.delete("/:screen/:id", BaseController.validateSession, ApiController.delete)

ApiRouter.get("/", (req, res) => {
	res.send("¡Bienvenido API v: 1.1.11")
})
