const express = require('express')
const router = new express.Router()
const fs = require('fs')
const util = require('../util')
const tmpStorageFolder = util.TMPSTORAGEFOLDER

// build functionality imports
const { spawn } = require("child_process")

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

const buildProcess = function(fileId, sendLogToClient) {
    let folderPath = tmpStorageFolder + fileId + '/';
    // let filePath = folderPath + "upload.zip"

    const ret = new Promise((resolve, reject) => {
        // const buildSpawn = spawn("bash", ["src/build.sh", fileId])
        const buildSpawn = spawn("bash", ["build.sh", fileId, folderPath])
        buildSpawn.stdout.on("data", (data) => {
            sendLogToClient(data.toString())
        });
        buildSpawn.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
            sendLogToClient(data.toString())
        });
        buildSpawn.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });
        buildSpawn.on("close", code => {
            sendLogToClient(`child process exited with code ${code}`)
            resolve()
        });
    })

    return ret
}

const buildFile = async (fileId, io) => {
    var totalLogs = ""
    activeBuilds[fileId] = totalLogs
    sendLogToClient = (newLog) => {
        totalLogs += newLog
        activeBuilds[fileId] = totalLogs
        io.emit(fileId, newLog)
    }

    sendLogToClient("Build started for: " + fileId + '\n\n')

    await buildProcess(fileId, sendLogToClient)

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