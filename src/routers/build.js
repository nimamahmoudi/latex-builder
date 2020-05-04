const express = require('express')
const router = new express.Router()
const fs = require('fs')
const util = require('../util')
const tmpStorageFolder = util.TMPSTORAGEFOLDER

var app;
var io;
const activeBuilds = {};

initializeUsingApp = (_app) => {
    app = _app
    io = app.io

    io.on('connection', (socket) => {
        // console.log('new websocket connection')
        socket.on('ready', (fileId) => {
            // if an active build exists
            if (activeBuilds.hasOwnProperty(fileId)) {
                socket.emit(fileId + '/dump', activeBuilds[fileId])
                return
            } else {
                buildFile(fileId, io)
            }
        });
    })
}

const buildFile = async (fileId, io) => {
    var totalLogs = ""
    activeBuilds[fileId] = totalLogs
    sendLogToClient = (newLog) => {
        totalLogs += newLog
        activeBuilds[fileId] = totalLogs
        io.emit(fileId, newLog)
    }

    let folderPath = tmpStorageFolder + fileId + '/';
    let filePath = folderPath + "upload.zip"

    sendLogToClient("Build started for: " + fileId + '\n\n')

    for (let i = 0; i < 200; i++) {
        sendLogToClient(`${i}\n`)
        await util.sleep(100)
    }

    sendLogToClient('\n\n' + 'Build done!' + '\n\n')
    delete activeBuilds[fileId]
}

router.get('/logs/:id', async (req, res) => {
    let fileId = req.params.id
    let io = req.app.io

    res.render('logs', {
        title: 'Building...',
        fileId: fileId,
    })
})

module.exports = function(app) {
    initializeUsingApp(app)
    return router
}