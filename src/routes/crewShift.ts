import express from "express";
import * as controller from '../controllers/crewShiftController.js'
import {bodyValidation} from "../validation/bodyValidation.js";
import {correctShiftDtoSchema} from "../validation/joiSchemas.js";

export const crewShiftRouter = express.Router()

crewShiftRouter.get("/start_shift/:table_num", controller.startShift)
crewShiftRouter.get("/finish_shift/:table_num", controller.finishShift)
crewShiftRouter.get("/break", controller.breakShift)
crewShiftRouter.post("/correctShift", bodyValidation(correctShiftDtoSchema), controller.correctShift)
crewShiftRouter.get("/currentShift/:table_num", controller.currentShift)