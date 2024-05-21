const mongoose = require('mongoose')


const Schema = mongoose.Schema

const historySchema = new Schema({
    input: {
        type: Array,
        required: true,
    },
    output: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }

}, { timestamps: true })



module.exports = mongoose.model('History', historySchema)

