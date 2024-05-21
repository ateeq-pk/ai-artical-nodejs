const express = require('express')
const {getHistory,getHistorys,createHistory,deleteHistory,updateHistory}=require('../controllers/historyController')


const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all history routes
router.use(requireAuth)

router.get('/', getHistorys)

router.get('/:id', getHistory)

router.delete('/', deleteHistory)

router.post('/', createHistory)

router.patch('/', updateHistory)

module.exports = router