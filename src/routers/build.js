const express = require('express')
const router = new express.Router()

const multer = require('multer')
const upload = multer({
    dest: 'uploads',
    limits: {
        fileSize: 10*1024*1024,
    }
})

router.post('/upload', upload.single('file'), async (req, res) => {


    res.send({
        success: true
    })
})

router.get('/', async (req, res) => {
    res.render('index', {
        title: 'Home',
    })
})

router.get('/logs', async (req, res) => {
    res.render('logs', {
        title: 'Building...',
    })
})

module.exports = router