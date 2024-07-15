import { Router } from "express"
import { FrontendController } from "../controllers/FrontendController.js"

export const FrontendRouters = Router()

FrontendRouters.get("/Authentication", FrontendController.signInSignUp)
FrontendRouters.get("/SelectCompany", FrontendController.validateSession, FrontendController.selectCompany)
FrontendRouters.get("/CreateCompany", FrontendController.validateSession, FrontendController.createCompany)
FrontendRouters.get("/SelectUsersGroups", FrontendController.validateSession, FrontendController.selectUsersGroups)

FrontendRouters.get("/Companies/Create", FrontendController.validateSession, FrontendController.createCompany)
FrontendRouters.get("/RenameProperty", FrontendController.validateSession, FrontendController.getFieldsProperties)
FrontendRouters.get("/:screen/DataScreen", FrontendController.validateSession, FrontendController.dataScreen)
FrontendRouters.get("/:screen/Create", FrontendController.validateSession, FrontendController.create)
FrontendRouters.get("/:screen", FrontendController.validateSession, FrontendController.list)
FrontendRouters.get("/", FrontendController.validateSession, FrontendController.home)
