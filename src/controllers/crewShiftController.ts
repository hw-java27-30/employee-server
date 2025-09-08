import {Request, Response} from "express";
import {EmployeeModel} from '../model/EmployeeMongoModels.js'
import CrewShiftMongo from '../services/CrewShiftServiceMongoImpl.js'
import Joi from "joi";

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

export const correctShift = async (req: Request, res: Response) => {
    const {tab_n_crew, tab_n_mng, start, finish, date} = req.body
    const manager = await EmployeeModel.find({tab_n_mng})
    const employee = await EmployeeModel.find({tab_n_crew})
    if (manager.length === 0 || employee.length === 0)
        return res.status(400).json("Employee or manager not found");
    const startTime = Math.floor(new Date(start).getTime() / (1000 * 60))
    const finishTime = Math.floor(new Date(finish).getTime() / (1000 * 60))
    const dateTime = Math.floor(new Date(date).getTime() / (1000 * 60))
    await service.correctShift(tab_n_crew, tab_n_mng, startTime, finishTime, dateTime)
    return res.status(200).json()
}

export const currentShift = async (req: Request, res: Response) => {
    const { table_num } = req.params;
    const employee = await EmployeeModel.find({table_num})
    if (employee.length === 0)
        return res.status(400).json("Employee not found");
    const  currentShiftInfo = await service.getCurrentShiftStaff(table_num)
    return res.status(200).json(currentShiftInfo)
}