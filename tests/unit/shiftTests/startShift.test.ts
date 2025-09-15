import {CrewShiftModel} from "../../../src/model/CrewShiftMongoModels.ts";
import CrewShiftMongo from "../../../src/services/ShiftService/CrewShiftServiceMongoImpl.ts"
import {getMonthHours} from "../../../src/utils/tools.ts";
jest.mock('../../../src/model/CrewShiftMongoModels.ts')

describe("CrewShiftServiceMongoImpl.startShift", () => {
    const service = CrewShiftMongo

    const mockCrewShiftNotFinished = {
        _id: 123,
        startShift: 2,
        finishShift: null,
        table_num: "123",
        shiftDuration: 0,
        breaks: 0,
        correct: null,
        monthHours: 0
    }

    const mockCrewShiftFinished = {
        _id: 123,
        startShift: 2,
        finishShift: 10,
        table_num: "123",
        shiftDuration: 8,
        breaks: 0,
        correct: null,
        monthHours: 0
    }
    //================1. Shift not finished======
    test("Test failed: Shift not finished", async () => {
        (CrewShiftModel.find as jest.Mock).mockReturnValue([mockCrewShiftNotFinished])
        await expect(service.startShift(mockCrewShiftNotFinished.table_num)).rejects.toThrow('Shift not finished. I cannot start a new shift.')
    })
    //================2. Check getMonthHours======
    test("Test passed: Check getMonthHours", () => {
        (CrewShiftModel.find as jest.Mock).mockReturnValue([mockCrewShiftFinished])
        expect(getMonthHours([mockCrewShiftFinished])).toEqual(mockCrewShiftFinished.shiftDuration)
    })
})