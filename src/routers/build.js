const express = require('express')
const router = new express.Router()
const fs = require('fs')
const util = require('../util')
const tmpStorageFolder = util.TMPSTORAGEFOLDER

// build functionality imports
const { spawn } = require("child_process")

const userFileUpload = util.userFileUpload

var app
var io
const activeBuilds = {}
var apmEnabled = false

initializeUsingApp = (_app) => {
    app = _app
    io = app.io

    if (app.apm) {
        apmEnabled = true
        console.log("APM Enabled!")
    }

    io.on('connection', (socket) => {
        // console.log('new websocket connection')
        socket.on('ready', (fileId) => {
            // if an active build exists
            if (activeBuilds.hasOwnProperty(fileId)) {
                socket.emit(fileId + '/dump', activeBuilds[fileId])
                return
            } else {
                buildFile(fileId, io, ["build_latex_docx.sh"])
            }
        });
    })
}

const buildProcess = function (fileId, sendLogToClient, buildScript) {
    // start recording monitoring data
    if (apmEnabled) {
        var apmName = 'BuildScript/' + buildScript
        var apmType = 'job'
        var apmTrans = app.apm.startTransaction(apmName, apmType)
        apmTrans.result = 'success'
    }

    let folderPath = tmpStorageFolder + fileId + '/';

    const ret = new Promise((resolve, reject) => {
        const buildSpawn = spawn("bash", ["build_scripts/" + buildScript, fileId, folderPath])
        buildSpawn.stdout.on("data", (data) => {
            sendLogToClient(data.toString())
        });
        buildSpawn.stderr.on("data", data => {
            sendLogToClient(data.toString())
        });
        buildSpawn.on('error', (error) => {
            console.log(`error: ${error.message}`);
            if (apmEnabled) apmTrans.result = 'error'
        });
        buildSpawn.on("close", code => {
            sendLogToClient(`child process exited with code ${code}`)
            if (apmEnabled) {
                if (code !== 0) {
                    apmTrans.result = 'error'
                }
                apmTrans.end()
            }
            resolve()
        });
    })

    return ret
}

const buildFile = async (fileId, io, build_scripts) => {
    // if an active build exists
    if (activeBuilds.hasOwnProperty(fileId)) {
        return
    }

    let folderPath = tmpStorageFolder + fileId + '/';
    let outputPath = tmpStorageFolder + fileId + '/output/';
    let totalLogs = ""
    activeBuilds[fileId] = totalLogs
    sendLogToClient = (newLog) => {
        totalLogs += newLog
        activeBuilds[fileId] = totalLogs
        io.emit(fileId, newLog)
    }
    clearLogs = () => {
        delete activeBuilds[fileId]
    }

    if (!fileId.match(/^[\w]+$/)) {
        sendLogToClient("Bad file name format")
        clearLogs()
        return
    }

    if (!fs.existsSync(folderPath) || !fs.existsSync(folderPath + 'upload.zip')) {
        sendLogToClient("Requested file doesn't exist")
        clearLogs()
        return
    }

    sendLogToClient("Build started for: " + fileId + '\n\n')

    for (buildScript of build_scripts) {
        await buildProcess(fileId, sendLogToClient, buildScript)
    }

    sendLogToClient('\n\n' + 'Build done!' + '\n\n')

    if (fs.existsSync(outputPath)) {
        // send download addresses back to client
        filenames = fs.readdirSync(outputPath)
        filenames.forEach((name) => {
            link = "/download/" + fileId + "/" + name
            io.emit(fileId + "/download", link)
        })
    }

    clearLogs()
}

returnGeneratedFile = (res, fileId, filename) => {
    // return the generated file to user
    let path = tmpStorageFolder + fileId + '/output/' + filename;
    if (fs.existsSync(path)) { //file exists
        fs.createReadStream(path).pipe(res);
    } else {
        res.status(404).send("File not found!")
    }
}

router.get('/download/:id/:file', async (req, res) => {
    let filename = req.params.file

    if (!filename.match(/^[\w.\- ]+\.(docx|pdf)$/)) {
        res.status(400).send("Bad file name format")
    }

    returnGeneratedFile(res, req.params.id, filename)
})

router.post('/sync/upload/:file', userFileUpload.single('file'), async (req, res) => {
    // check output file name
    let filename = req.params.file
    if (!filename.match(/^[\w.\- ]+\.(docx|pdf)$/)) {
        res.status(400).send("Bad file name format")
    }

    // build uploaded file
    const fileId = req.randomFolder
    let io = req.app.io
    await buildFile(fileId, io, ["build_latex_docx.sh"])

    returnGeneratedFile(res, fileId, filename)
})

router.post('/sync/md/rst/upload/:file', userFileUpload.single('file'), async (req, res) => {
    // check output file name
    let filename = req.params.file
    if (!filename.match(/^[\w.\- ]+\.(rst)$/)) {
        res.status(400).send("Bad file name format")
    }

    // build uploaded file
    const fileId = req.randomFolder
    let io = req.app.io
    await buildFile(fileId, io, ["build_md_rst.sh"])

    returnGeneratedFile(res, fileId, filename)
})

router.get('/logs/:id', async (req, res) => {
    let fileId = req.params.id
    let io = req.app.io

    buildFile(fileId, io, ["build_latex_docx.sh"])

    res.render('logs', {
        title: 'Building...',
        fileId: fileId,
    })
})

module.exports = function (app) {
    initializeUsingApp(app)
    return router
}