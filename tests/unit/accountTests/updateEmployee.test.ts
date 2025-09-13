import {accountServiceMongo} from "../../../src/services/accountingService/AccountServiceMongoImpl.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongoModels.ts";
import {UpdateEmployeeDto} from "../../../src/model/Employee.ts";
jest.mock("../../../src/model/EmployeeMongoModels.ts")


describe('AccountServiceMongoImpl.updateEmployee', () => {
    const service = accountServiceMongo

    const mockUpdateEmployee: UpdateEmployeeDto = {
        firstName: "Mock",
        lastName: "Mock",
    }

    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23498",
        lastName: "MOCK",
        roles: 'crew',
        table_num: "tab_num"
    };
    //================1. Employee not exists======
    test("Failed test: Employee not found", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        await expect(service.updateEmployee('123', mockUpdateEmployee)).rejects.toThrow("Employee updating failed!")
    })
})