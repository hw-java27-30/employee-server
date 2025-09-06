import {CrewShiftService} from "./CrewShiftService.js";
import {CrewShiftModel} from "../model/CrewShiftMongoModels.js";
import {CrewShift} from "../model/CrewShift.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {generateTabNumber} from "../utils/tools.js";

export class CrewShiftServiceMongoImpl implements CrewShiftService {
    break(tab_n: string, number: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    finishShift(tab_n: string): Promise<{ tab_num: string; time: string }> {
        return Promise.resolve({tab_num: "", time: ''});
    }

    async startShift(tab_n: string): Promise<{ tab_num: string; time: string }> {
        const shift = await CrewShiftModel.find({table_num: tab_n}) as CrewShift[] | undefined
        if (shift) {
            const notFinishedShift = shift.find(s => s.finishShift === null)
            if (notFinishedShift) {
                throw new HttpError(400, 'Shift not finished. I cannot start a new shift.');
            }
        }
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