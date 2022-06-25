const {Router} = require('express')

const router = Router()

const { addPlayer, isPlayer } = require('../modules/lobby')

router.get('/', (req, res) =>{
    res.render('index');
})

router.post('/', (req, res) => {
    if (isPlayer(req.body.name)){
        res.render('gameLobby');
        return;
    }
    addPlayer(req.body.name);
    res.render('gameLobby')
})

module.exports = router