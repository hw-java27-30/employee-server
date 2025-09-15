import {accountServiceMongo} from "../../../src/services/accountingService/AccountServiceMongoImpl.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongoModels.ts";

jest.mock("../../../src/model/EmployeeMongoModels.ts");
jest.mock("../../../src/utils/tools.ts");


describe("AccountServiceMongoImpl.changePassword", () => {
    const service = accountServiceMongo;

    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23498",
        lastName: "MOCK",
        roles: 'crew',
        table_num: "tab_num"
    };

    //================1. Employee not exists======
    test("Test failed: employee not exists", async () => {
        (EmployeeModel as any).findByIdAndUpdate.mockResolvedValue(null);
        await expect(service.changePassword(mockEmployee._id, mockEmployee.hash)).rejects.toThrow(`Employee with id ${mockEmployee._id} not found`)
    });
    //================2. password changed======
    test("Test passed", async () => {
        (EmployeeModel as any).findByIdAndUpdate.mockResolvedValue(mockEmployee);
        await expect(service.changePassword(mockEmployee._id, mockEmployee.hash)).resolves.toBeUndefined();
    });

})