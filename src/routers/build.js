const express = require('express')
const router = new express.Router()
const fs = require('fs')
const util = require('../util')
const tmpStorageFolder = util.TMPSTORAGEFOLDER

router.get('/logs/:id', async (req, res) => {
    let folderPath = tmpStorageFolder + req.params.id + '/';
    let filePath = folderPath + "upload.zip"
    console.log(filePath)
    res.render('logs', {
        title: 'Building...',
    })
})

module.exports = router