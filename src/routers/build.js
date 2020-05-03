const express = require('express')
const router = new express.Router()

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