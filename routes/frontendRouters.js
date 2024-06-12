import { Router } from "express"
import { FrontendController } from "../controllers/FrontendController.js"

export const frontendRouters = Router()

frontendRouters.get("/:screen/DataScreen", FrontendController.dataScreen)
frontendRouters.get("/:screen/Create", FrontendController.create)
frontendRouters.get("/:screen", FrontendController.list)
frontendRouters.get("/", FrontendController.home)
frontendRouters.get("/RenameProperty", FrontendController.getFieldsProperties)
