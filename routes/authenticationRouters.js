import { Router } from "express"
import { BaseController } from "../controllers/BaseController.js"

export const authenticationRouters = Router()

// Authentication
authenticationRouters.get("/", BaseController.SignInSignUp)
authenticationRouters.get("/test", BaseController.ValidateSession, BaseController.Test)

authenticationRouters.get("/SelectCompany", BaseController.SelectCompany)
authenticationRouters.get("/CreateCompany", BaseController.CreateCompany)
authenticationRouters.get("/SelectUsersGroups", BaseController.SelectUsersGroups)
