const {Router} = require("express");
const {getLobbies,getPlayers } = require('../modules/lobby')

const router = Router()

router.get('/players', (req, res) => {

    res.send(getPlayers());
})
router.get('/lobby', (req, res) => {

    res.send(getLobbies());
})

module.exports = router