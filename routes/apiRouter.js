import { Router } from "express"
import { BaseController } from "../controllers/BaseController.js"
import { ApiController } from "../controllers/ApiController.js"

export const apiRouter = Router()

apiRouter.get("/RenameProperty", ApiController.renameProperty)
apiRouter.post("/SignUp", ApiController.signUp)
apiRouter.post("/SignIn", ApiController.signIn)
apiRouter.post("/PsasswordReset", ApiController.passwordReset)
apiRouter.post("/SignOut", ApiController.signOut)
apiRouter.post("/SelectCompany/:ID", ApiController.setCompany)
apiRouter.get("/Companies", BaseController.validateSession, ApiController.usersCompanies)
apiRouter.get("/Test", BaseController.validateSession, ApiController.test)

apiRouter.post("/Companies", ApiController.saveCompany)
apiRouter.get("/:screen/:id", ApiController.find)
apiRouter.get("/:screen/name/:name", ApiController.findByName)
apiRouter.get("/:screen", BaseController.validateSession, ApiController.get)
apiRouter.post("/:screen", ApiController.post)
apiRouter.patch("/:screen/:id", ApiController.patch)
apiRouter.delete("/:screen/:id", ApiController.delete)

apiRouter.get("/", (req, res) => {
	res.send("¡Bienvenido API v: 1.1.11")
})
