import {CrewShiftService} from "./CrewShiftService.js";
import {CrewShiftModel} from "../../model/CrewShiftMongoModels.js";
import {CrewShift, CurrentCrewShift} from "../../model/CrewShift.js";
import {HttpError} from "../../errorHandler/HttpError.js";
import {logger} from "../../Logger/winston.js";
import {generateShiftId, getMonthHours} from "../../utils/tools.js";

export class CrewShiftServiceMongoImpl implements CrewShiftService {
    async breakShift(tab_n: string, number: number): Promise<void> {
        const shift = await CrewShiftModel.findOneAndUpdate(
            { table_num: tab_n, finishShift: null },
            { $set: { breaks: number } },
            { new: true }
        );
        if (!shift) {
            logger.error(`${new Date().toISOString()} => BreakShift Error`)
            throw new HttpError(400, 'Shift not found')
        }
        logger.info(`${new Date().toISOString()} => breakShift finished successfully.`)
        return
    }

    async finishShift(tab_n: string): Promise<{ tab_num: string; time: string }> {
        const time = new Date().toISOString()
        const minutes = Math.floor(new Date(time).getTime() / (1000 * 60))
        const shift = await CrewShiftModel.findOneAndUpdate(
            { table_num: tab_n, finishShift: null },
            [{ $set: {finishShift: minutes, shiftDuration: {$subtract : [minutes, '$startShift']}}}],
            {new: true}
        ).exec();
        if (!shift) {
            logger.error(`${new Date().toISOString()} => finishShift Error`)
            throw new HttpError(409, 'Opened shift not found')
        }
        logger.info(`${new Date().toISOString()} => finishShift finished successfully.`)
        return Promise.resolve({tab_num: tab_n, time: time});
    }

    async startShift(tab_n: string): Promise<{ tab_num: string; time: string }> {
        const shift = await CrewShiftModel.find({table_num: tab_n}) as CrewShift[] | undefined
        const notFinishedShift = shift?.find(item => item.finishShift == null)
        if (notFinishedShift) {
            logger.error(`${new Date().toISOString()} => startShift Error`)
            throw new HttpError(400, 'Shift not finished. I cannot start a new shift.');
        }
        let monthHours = getMonthHours(shift as CrewShift[]);
        const time = new Date().toISOString();
        const minutes = Math.floor(new Date(time).getTime() / (1000 * 60));
        const newShift = new CrewShiftModel({
            _id: generateShiftId(),
            startShift: minutes,
            finishShift: null,
            table_num: tab_n,
            shiftDuration: 0,
            breaks: 0,
            correct: null,
            monthHours
        })
        await newShift.save()
        logger.info(`${new Date().toISOString()} => startShift finished successfully.`)
        return Promise.resolve({tab_num: tab_n, time: time});
    }

    async correctShift(tab_n_crew: string, tab_n_mng: string, start: number, finish: number, date: number): Promise<void> {
        const shift = await CrewShiftModel.findOne({table_num: tab_n_crew, startShift: date})
        if (!shift) {
            logger.error(`${new Date().toISOString()} => correctShift Error. Shift not found`)
            throw new HttpError(400, 'Shift not found')
        }
        if (shift && shift.finishShift === null) {
            logger.error(`${new Date().toISOString()} => correctShift Error. Unfinished shift`)
            throw new HttpError(400, 'You cannot correct unfinished shift.')
        }
        shift.startShift = start
        shift.finishShift = finish
        shift.shiftDuration = finish - start
        shift.correct = tab_n_mng
        await shift.save()
        logger.info(`${new Date().toISOString()} => correctShift finished successfully.`)
    }

    async getCurrentShiftStaff(tab_n:string): Promise<CurrentCrewShift> {
        const shift = await CrewShiftModel.findOne({table_num: tab_n, finishShift: null})
        let currentShift : CurrentCrewShift;
        if (!shift) {
            logger.error(`${new Date().toISOString()} => getCurrentShiftStaff Error.`)
            throw new HttpError(400, 'Shift not found')
        }
        currentShift = {
            table_num: tab_n,
            startShift: new Date(shift.startShift * 60 * 1000).toISOString(),
            breaks: shift.breaks
        }
        logger.info(`${new Date().toISOString()} => getCurrentShiftStaff finished successfully.`)
        return currentShift
    }

}

export default new CrewShiftServiceMongoImpl()