import {NextFunction, Response, Request} from "express";
import {Employee, EmployeeDto, UpdateEmployeeDto} from "../model/Employee.js";
import {convertEmployeeDtoToEmployee} from "../utils/tools.js";
import {accountServiceMongo} from "../services/AccountServiceMongoImpl.js";

const service = accountServiceMongo;

export const setRole = (req: Request, res: Response, next: NextFunction) => {

};


export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    const query_id = req.query.id;
    const result = await service.getEmployeeById(query_id as string)
};


export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    const result = await service.getAllEmployees();
    res.json(result)
};


export const updatePassword = (req: Request, res: Response, next: NextFunction) => {

};


export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const query_id = req.query.id;
    const result = await service.updateEmployee(query_id as string, body as UpdateEmployeeDto);
    res.json(result);
};


export const fireEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const query_id = req.query.id;
    const result = await service.fireEmployee(query_id as string);
    res.json(result);
}


export const hireEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const emp: Employee = convertEmployeeDtoToEmployee(body as EmployeeDto);
    const result = await service.hireEmployee(emp);
    res.status(201).json(result);
}