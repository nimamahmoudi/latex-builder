const path = require('path')
const express = require('express')
const hbs = require('hbs')

const util = require('./util')

const app  = express()
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
const buildRouter = require('./routers/build')
app.use(buildRouter)

// 404 Page
app.get('*', (req, res) => {
    res.status(404).render("error", {
        title: "404 - Page Not Found!"
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})
