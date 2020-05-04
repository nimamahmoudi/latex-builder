const express = require('express')
const router = new express.Router()
const fs = require('fs')
const util = require('../util')
const tmpStorageFolder = util.TMPSTORAGEFOLDER


const buildFile = async (fileId, io) => {
    let folderPath = tmpStorageFolder + fileId + '/';
    let filePath = folderPath + "upload.zip"

    io.emit(fileId, "Build started for: " + fileId + '\n\n')

    for (let i = 0; i < 10; i++) {
        io.emit(fileId, `${i}\n`)
    }

    io.emit(fileId, '\n\n' + 'Build done!' + '\n\n')
}

router.get('/logs/:id', async (req, res) => {
    let fileId = req.params.id
    let io = req.app.io

    setTimeout(() => {
        // build the file
        buildFile(fileId, io)
    }, 3000)

    res.render('logs', {
        title: 'Building...',
        fileId: fileId,
    })
})

module.exports = router