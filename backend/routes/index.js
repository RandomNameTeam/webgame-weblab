const {Router} = require('express')

const router = Router()

const { addPlayer, isPlayer } = require('../modules/lobby')

router.get('/', (req, res) =>{
    res.render('index');
})

router.post('/', (req, res) => {
    addPlayer(req.body.name);
    if (isPlayer(req.body.name)){
        res.render("index");
    }
    res.render('gameLobby')
})

module.exports = router