import * as mongoose from "mongoose";

export const CrewShiftMongoModels = new mongoose.Schema({
        _id: {type: Number, required: true},
        startShift: {type:Number, required:true},
        finishShift:{type:Number, default:null},
        table_num: {type:String, required:true},
        shiftDuration: {type:Number, default:0},
        breaks: {type:Number, default:null},
        correct: {type: String, default:null},
        monthHours: {type:Number, default:0},
})

export const CrewShiftModel = mongoose.model('CrewShift', CrewShiftMongoModels, 'crew_shift_collection')