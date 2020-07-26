const express = require('express')
const path = require('path')
const userRoute = require('./routes/user')
const donardonate = require('./routes/Donar_donate')
const searchdonars = require('./routes/search_donar')
const search_donar_post = require('./routes/serach_donar_post')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const Swal = require("sweetalert2");
const MongoStore = require("connect-mongo")(session);
const test = require('./routes/test')
const dotenv = require("dotenv")
const Db = require('./config/db')
const app = express();


//sessions
app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: "keyboard cat",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: true,
      secure: false,
    },
  })
);


app.use(flash())


//config env
dotenv.config({ path : './config/config.env' })

app.use('/public',express.static(path.join(__dirname,'public')))

//Body parser
app.use(express.json())

//Template engine
app.set('view engine','ejs')

//Routes
app.use('/',userRoute)
app.use('/donardonate', donardonate)
app.use('/searchdonar', searchdonars);
app.use('/searchdonarpost', search_donar_post);
app.use('/test',test)

const port = process.env.PORT || 5000;
app.listen(port,() => {
    console.log(`Listening to port ${port}`)
})