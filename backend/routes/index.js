const {Router} = require('express')

const router = Router()

const { addPlayer, inWaitingByName } = require('../modules/lobby')

router.get('/', (req, res) =>{
    console.log(req.cookies['uuid'])
    if(req.cookies['uuid']){
        res.redirect('/lobby')
        return
    }
    res.render('index')
})
router.get('/lobby', (req,res) => {

    res.render('gameLobby',{name: req.cookies['name']})
})
router.get('/leave', (req,res) => {
    res.clearCookie('uuid')
    res.clearCookie('name')
    res.redirect('/')
})
router.post('/', (req, res) => {

    let client = inWaitingByName(req.body.name)
    let id

    if (client) id = client.id
    else id = addPlayer(req.body.name)

    res.cookie('uuid', id)
    res.cookie('name', req.body.name)
    res.redirect('/lobby')
})

module.exports = router