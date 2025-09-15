import {CrewShiftModel} from "../../../src/model/CrewShiftMongoModels.ts";
import CrewShiftMongo from "../../../src/services/ShiftService/CrewShiftServiceMongoImpl.ts"
jest.mock('../../../src/model/CrewShiftMongoModels.ts')

describe("CrewShiftServiceMongoImpl.finishShift", () => {
    const service = CrewShiftMongo

    const NOW_ISO = '2025-01-01T12:34:56.000Z';
    const NOW_MS = Date.parse(NOW_ISO);

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(NOW_MS));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });


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
    //================1. Opened shift not found======
    test("Test failed: Opened shift not found", async () => {
        (CrewShiftModel.findOneAndUpdate as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        await expect(service.finishShift(mockCrewShiftFinished.table_num)).rejects.toThrow("Opened shift not found")
    })
    //================2. Shift finished======
    test("Test passed: Shift finished", async () => {
        (CrewShiftModel.findOneAndUpdate as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockCrewShiftFinished)
        });
        await expect(service.finishShift(mockCrewShiftFinished.table_num)).resolves.toEqual({ tab_num: '123', time: NOW_ISO });
    })
})