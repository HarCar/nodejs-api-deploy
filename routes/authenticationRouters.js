import { Router } from "express"
import { ApiController } from "../controllers/ApiController.js"
import { BaseController } from "../controllers/BaseController.js"

export const authenticationRouters = Router()

// Authentication
authenticationRouters.get("/", ApiController.signInSignUp)
authenticationRouters.get("/test", BaseController.validateSession, ApiController.test)

authenticationRouters.get("/SelectCompany", ApiController.selectCompany)
authenticationRouters.get("/CreateCompany", ApiController.createCompany)
authenticationRouters.get("/SelectUsersGroups", ApiController.selectUsersGroups)
