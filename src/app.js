// Add this to the VERY top of the first file loaded in your app
if (process.env.ELASTIC_APM_SERVICE_NAME) {
    var apm = require('elastic-apm-node').start({
        // uncomment this to show crashes, otherwise it will capture crashed and send to APM
        captureExceptions: true,
    })
}

const path = require('path')
const http = require('http')
const express = require('express')
const hbs = require('hbs')
const socketio = require('socket.io')

const util = require('./util')

const app  = express()
const server = http.createServer(app)
const io = socketio(server)
// so that we can access io from req.app.io
app.io = io
app.apm = apm

const port = process.env.PORT || 3000

// Setup Handelbard engine and folder
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Parse incoming json
app.use(express.json())
// Parse form data
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
// Allow sessions
var session = require('express-session')
app.use(session({
	secret: util.SESSIONSECRET,
	resave: true,
	saveUninitialized: true
}));
// Setup static directory
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
// CORS
const cors = require('cors')
app.use(cors())

// Setup Routers
const indexRouter = require('./routers/index')
app.use(indexRouter)
const buildRouter = require('./routers/build')(app)
app.use(buildRouter)

// 404 Page
app.get('*', (req, res) => {
    res.status(404).render("error", {
        title: "404 - Page Not Found!"
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})
