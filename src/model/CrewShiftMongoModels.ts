import * as mongoose from "mongoose";

export const CrewShiftMongoModels = new mongoose.Schema({
        shift_id: {type:Number, required:true},
        startShift: {type:Number, min:0, required:true},
        finishShift:{type:Number, default:null},
        table_num: {type:String, required:true},
        shiftDuration: {type:Number, required:true, default:0},
        breaks: {type:Number, required:true, default:0},
        correct: {type: String, default:""},
        monthHours: {type:Number, min:0, required:true, default:0},
})

export const CrewShiftModel = mongoose.model('CrewShift', CrewShiftMongoModels, 'crew_shift_collection')