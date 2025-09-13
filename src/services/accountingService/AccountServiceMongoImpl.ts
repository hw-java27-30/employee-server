import {AccountService} from "./AccountService.js";
import {Employee, EmployeeDto, SavedFiredEmployee, UpdateEmployeeDto} from "../../model/Employee.js";
import {EmployeeModel, FiredEmployeeModel} from "../../model/EmployeeMongoModels.js";
import {HttpError} from "../../errorHandler/HttpError.js";
import {checkFiredEmployees, checkRole, convertEmployeeToFiredEmployee} from "../../utils/tools.js";
import bcrypt from "bcryptjs";
import {loggerV2} from "../../Logger/winston.js";

class AccountServiceMongoImpl implements AccountService {

    async changePassword(empId: string, newPassword: string): Promise<void> {
        const updated = await EmployeeModel.findByIdAndUpdate(empId,
            {$set: {hash: bcrypt.hashSync(newPassword, 10)}}, {new: true})
        if (!updated) {
            loggerV2.error(`Employee with id ${empId} not found`)
            throw new HttpError(404, `Employee with id ${empId} not found`)
        }
        loggerV2.info(`Employee with id ${empId} updated`)
    }

    async fireEmployee(empId: string): Promise<SavedFiredEmployee> {
        const temp = await EmployeeModel.findByIdAndDelete(empId);
        if (!temp) {
            loggerV2.error(`Employee with id ${empId} not found`)
            throw new HttpError(404, `Employee with id ${empId} not found`)
        }
        const fired:SavedFiredEmployee = convertEmployeeToFiredEmployee(temp as Employee);
        const firedDoc = new FiredEmployeeModel(fired);
        await firedDoc.save()
        loggerV2.info(`Employee with id ${empId} fired`)
        return fired;
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const result = await EmployeeModel.find({}).exec();
        return result as SavedFiredEmployee[]
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await EmployeeModel.findById(id).exec();
        if (!employee) {
            loggerV2.error(`Employee with id ${id} not found`)
            throw new HttpError(404, `Employee with id ${id} not found`)
        }
        return employee;
    }

    async hireEmployee(employee: Employee): Promise<Employee> {
        const temp = await EmployeeModel.findById(employee._id).exec();
        if(temp) {
            loggerV2.error(`Employee with id ${employee._id} already exists`)
            throw new HttpError(409, `Employee with id ${employee._id} already exists`)
        }
        await checkFiredEmployees(employee._id)
        const empDoc = new EmployeeModel(employee);
        await empDoc.save();
        loggerV2.info(`Employee with id ${employee._id} hired`)
        return employee;
    }

    async setRole(id: string, newRole: string): Promise<Employee> {
        const emp = await this.getEmployeeById(id)
        const role = checkRole(newRole);
        const updated = await EmployeeModel.findOneAndUpdate({id}, {
            $set: {roles: newRole}
        }, {new: true}).exec();
        if (!updated) {
            loggerV2.error(`Employee with id ${id} updating failed!`)
            throw new HttpError(500, "Employee updating failed!")
        }
        loggerV2.info(`Employee with id ${id} changed roles successfully`)
        return updated as Employee

    }

    async updateEmployee(empId: string, employee: UpdateEmployeeDto): Promise<Employee> {
        const updated = await EmployeeModel.findByIdAndUpdate(empId, {
            $set: {firstName: employee.firstName, lastName: employee.lastName}}, {new: true}).exec();
        if (!updated) {
            loggerV2.error("Employee updating failed!")
            throw new HttpError(404, "Employee updating failed!")
        }
        loggerV2.info(`Employee with id ${empId} updated successfully`)
        return updated as Employee
    }

    async getAllEmployeesWithPagination(page: number, limit: number){
        const skip = (page - 1) * limit;
        const [employees, total] = await Promise.all([
            EmployeeModel.find().skip(skip).limit(limit),
            EmployeeModel.countDocuments()
        ])
        return {employees, total};
    }

    async getEmployeeByTabNum(tabNum: string) {
        const emp = await EmployeeModel.findOne({table_num: tabNum})
        if (!emp) {
            loggerV2.error(`Employee with table number ${tabNum} not found`)
            throw new HttpError(404, `Employee with table number ${tabNum} not found`)
        }
        return emp as Employee;
    }
}

export const accountServiceMongo = new AccountServiceMongoImpl();