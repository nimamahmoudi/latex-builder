const JWTSECRET = process.env.JWTSECRET || "nJky3Fg9GdfLVyWNZJqpPk7nA5eBnrs5"
const SESSIONSECRET = process.env.SESSIONSECRET || "cUYV6G25L7Msa64z8P7YLQkCH9U3X6Bu"
const TMPSTORAGEFOLDER = process.env.TMPFOLDER || './tmp/'

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

module.exports = {
    JWTSECRET,
    SESSIONSECRET,
    makeid,
    TMPSTORAGEFOLDER,
    sleep,
}
