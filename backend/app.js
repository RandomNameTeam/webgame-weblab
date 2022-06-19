const http = require('http');
const express = require('express');
const indexRouter = require('./routes/index')
const panelRouter = require('./routes/panel')


const app = express();

app.set('views', "../frontend")
app.set('view engine', 'ejs')

app.use(express.static("../public"));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/panel', panelRouter)
app.use('/', indexRouter)


module.exports = {app}
