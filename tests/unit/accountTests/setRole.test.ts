import {accountServiceMongo} from "../../../src/services/accountingService/AccountServiceMongoImpl.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongoModels.ts";
import {checkRole} from "../../../src/utils/tools.ts";
import {HttpError} from "../../../src/errorHandler/HttpError.ts";
import {Roles} from "../../../src/utils/Roles.ts";
jest.mock("../../../src/model/EmployeeMongoModels.ts");
jest.mock("../../../src/utils/tools.ts");


describe("AccountServiceMongoImpl.setRole", () => {
    const service = accountServiceMongo;

    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23498",
        lastName: "MOCK",
        roles: 'crew',
        table_num: "tab_num"
    };

    const mockNewEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23498",
        lastName: "MOCK",
        roles: 'supervisor',
        table_num: "tab_num"
    }
    //================1. Employee not exists======
    test("Test failed: employee not exists", async () => {
        (EmployeeModel as any).findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        await expect(service.setRole(mockEmployee._id, mockEmployee.roles)).rejects.toThrow(`Employee with id ${mockEmployee._id} not found`)
    });
    //================2. wrong role======
    test("Test failed: wrong role", async () => {
        (EmployeeModel as any).findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee)
        });
        (checkRole as jest.Mock).mockImplementation(() => {
            throw new HttpError(400, 'Wrong role!');
        });
        await expect(service.setRole(mockEmployee._id, 'roles')).rejects.toThrow("Wrong role!");
    });
    //================3. set role successfully======
    test("Test passed", async () => {
        (EmployeeModel as any).findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee)
        });
        (checkRole as jest.Mock).mockImplementation(() => {
            return Roles.SUPER
        });
        (EmployeeModel.findOneAndUpdate as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockNewEmployee)
        });
        await expect(service.setRole(mockEmployee._id, Roles.SUPER)).resolves.toEqual(mockNewEmployee);
        expect((EmployeeModel as any).findById).toHaveBeenCalledWith(mockEmployee._id)
        expect(checkRole).toHaveBeenCalledWith(Roles.SUPER)
    }
    )
})