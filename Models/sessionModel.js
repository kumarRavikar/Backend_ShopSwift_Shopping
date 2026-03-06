import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,
            ref:'User'
    }
})
 export const SessionModel = mongoose.model('Session',sessionSchema) 