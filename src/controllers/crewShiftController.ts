import {Request, Response} from "express";
import {EmployeeModel} from '../model/EmployeeMongoModels.js'
import CrewShiftMongo from '../services/CrewShiftServiceMongoImpl.js'

const service = CrewShiftMongo

export const startShift = async (req: Request, res: Response) => {
    const { table_num } = req.params;
    const employee = await EmployeeModel.find({table_num})
    if (employee.length === 0)
        return res.status(400).json("Employee not found");
    const result = await service.startShift(table_num)
    return res.status(200).json(result)
}

export const finishShift = async (req: Request, res: Response) => {
    const { table_num } = req.params;
    const employee = await EmployeeModel.find({table_num})
    if (employee.length === 0)
        return res.status(400).json("Employee not found");
    const result = await service.finishShift(table_num)
    return res.status(200).json(result)
}

export const breakShift = async (req: Request, res: Response) => {
    const { table_num, min } = req.query;
    const employee = await EmployeeModel.find({table_num})
    if (employee.length === 0)
        return res.status(400).json("Employee not found");
    const time = parseInt(min as string)
    if (!time)
        return res.status(400).json("Wrong time params");
    await service.breakShift(table_num as string, time)
    return res.status(200).json()
}