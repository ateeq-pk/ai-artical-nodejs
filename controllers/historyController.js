const History = require('../models/userHistory')
const mongoose=require('mongoose')

//get all workouts
const getHistorys = async (req, res) => {
    const user_id = req.user._id
    //the object inside find used to get all object with specific value
    //and the sort method sort the data and -1 in asending order
    const historys = await History.find({user_id}).sort({ createdAt: -1 })
    res.status(200).json(historys)
}


//get single workout
const getHistory = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'No such hsitory Or invlaid Id' })
    }
    const history = await History.findById(id)
    if (!history) {
        return res.status(404).json({ error: 'No such hsitory' })
    }
    res.status(200).json(history)
}

//create new workout
const createHistory = async (req, res) => {
    const { input, output} = req.body
    const user_id=req.user._id
    console.log(input)
    //add document in db
    try {
        const history = await History.create({ input, output, user_id })
        res.status(200).json(history)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete a workout
const deleteHistory= async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'No such history Or invlaid Id' })
    }
    const history = await History.findOneAndDelete({_id:id})
    if (!history) {
        return res.status(400).json({ error: 'No such history' })
    }
    res.status(200).json(history)
}

// update a workout
const updateHistory= async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ error: 'No such history Or invlaid Id' })
    }
    const history = await History.findOneAndUpdate({_id:id},{
        ...req.body
    })
    if (!history) {
        return res.status(400).json({ error: 'No such history' })
    }
    res.status(200).json(history)
}



module.exports = {
    getHistorys,
    getHistory,
    createHistory,
    deleteHistory,
    updateHistory
}