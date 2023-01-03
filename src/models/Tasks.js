import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    description: {
        type: String, required: true, trim: true
    },
    completed: {
        type: Boolean, default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
})

const Task = mongoose.model('Task', taskSchema)

export default Task