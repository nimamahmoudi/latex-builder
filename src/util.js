const JWTSECRET = process.env.JWTSECRET || "nJky3Fg9GdfLVyWNZJqpPk7nA5eBnrs5"
const SESSIONSECRET = process.env.SESSIONSECRET || "cUYV6G25L7Msa64z8P7YLQkCH9U3X6Bu"
const TMPSTORAGEFOLDER = process.env.TMPFOLDER || './tmp/'

// for multer functionality
const fs = require('fs')
const multer = require('multer')

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const tmpUserStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        req.randomFolder = makeid(32)
        let dir = TMPSTORAGEFOLDER + req.randomFolder
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname)
        cb(null, 'upload.zip')
    }
})


const userFileUpload = multer({
    dest: 'uploads',
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    storage: tmpUserStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(zip|ZIP)$/)) {
            return cb(new Error("Please upload a zip file!"));
        }

        cb(undefined, true);
    }
})

module.exports = {
    JWTSECRET,
    SESSIONSECRET,
    makeid,
    TMPSTORAGEFOLDER,
    sleep,
    userFileUpload,
}
