import {CrewShiftService} from "./CrewShiftService.js";
import {CrewShiftModel} from "../model/CrewShiftMongoModels.js";
import {CrewShift} from "../model/CrewShift.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {generateTabNumber} from "../utils/tools.js";
import {startShift} from "../controllers/crewShiftController.js";

export class CrewShiftServiceMongoImpl implements CrewShiftService {
    async breakShift(tab_n: string, number: number): Promise<void> {
        const shift = await CrewShiftModel.findOneAndUpdate(
            { table_num: tab_n, finishShift: null },
            { $set: { breaks: number } },
            { new: true }
        );
        if (!shift) throw new HttpError(400, 'Shift not found')
        return
    }

    async finishShift(tab_n: string): Promise<{ tab_num: string; time: string }> {
        const time = new Date().toISOString()
        const minutes = Math.floor(new Date(time).getTime() / (1000 * 60))
        const shift = await CrewShiftModel.findOneAndUpdate(
            { table_num: tab_n, finishShift: null }
        );
        if (!shift) throw new HttpError(400, 'Shift not started. I cannot finish a new shift.')
        const diff = minutes - shift.startShift;
        shift.finishShift = minutes
        shift.shiftDuration = shift.shiftDuration + diff
        await shift.save()
        return Promise.resolve({tab_num: tab_n, time: time});
    }

    async startShift(tab_n: string): Promise<{ tab_num: string; time: string }> {
        const shift = await CrewShiftModel.findOne({table_num: tab_n, finishShift: null}) as CrewShift | undefined
        if (shift) throw new HttpError(400, 'Shift not finished. I cannot start a new shift.');

        const time = new Date().toISOString()
        const minutes = Math.floor(new Date(time).getTime() / (1000 * 60))
        const newShift = new CrewShiftModel({
            shift_number: generateTabNumber(),
            table_num: tab_n,
            startShift: minutes,
        })
        await newShift.save()
        return Promise.resolve({tab_num: tab_n, time: time});
    }
}

export default new CrewShiftServiceMongoImpl()