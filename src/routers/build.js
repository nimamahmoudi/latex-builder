const express = require('express')
const router = new express.Router()
const fs = require('fs')
const util = require('../util')
const tmpStorageFolder = util.TMPSTORAGEFOLDER

const multer = require('multer')

const tmpUserStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        req.randomFolder = util.makeid(32)
        let dir = tmpStorageFolder + req.randomFolder
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({
    dest: 'uploads',
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    storage: tmpUserStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(zip|ZIP)$/)) {
            return cb(new Error("Please upload a zip file!"));
        }

        cb(undefined, true);
    }
})

router.post('/upload', upload.single('file'), async (req, res) => {
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

router.get('/logs', async (req, res) => {
    res.render('logs', {
        title: 'Building...',
    })
})

module.exports = router