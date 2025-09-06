import {Request, Response} from "express";
import {EmployeeModel} from '../model/EmployeeMongoModels.js'
import CrewShiftMongo from '../services/CrewShiftServiceMongoImpl.js'

const service = CrewShiftMongo

export const startShift = async (req: Request, res: Response) => {
    const { table_num } = req.params;
    const employee = await EmployeeModel.find({table_num})
    if (!employee)
        res.status(400).json("Employee not found");
    const result = await service.startShift(table_num)
    return res.status(200).json(result)




}