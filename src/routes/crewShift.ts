import express from "express";
import * as controller from '../controllers/crewShiftController.js'

export const crewShiftRouter = express.Router()

crewShiftRouter.get("/start_shift/:table_num", controller.startShift)