const express = require('express')
const router = new express.Router()

const util = require('../util')


const userFileUpload = util.userFileUpload

router.post('/upload', userFileUpload.single('file'), async (req, res) => {
    res.send({
        success: true,
        folderName: req.randomFolder
    })
}, (error, req, res, next) => {
    res.status(400).send({
        success: false,
        message: error.message,
    })
})

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Home',
    })
})

module.exports = router