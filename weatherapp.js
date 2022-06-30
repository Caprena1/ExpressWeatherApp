const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const dotenv = require('dotenv').config({path: './.env'})

//SETTING VIEWS ENGINE
app.set('views', './views')
app.set('view engine', 'pug')

//USE IMAGES AND STYLESHEET
app.use('/images', express.static('public'))
app.use('/styles', express.static('styles'))

//BODY PARSER FOR FORMS
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('weatherreq')
})

app.post('/weatherreq', (req, res) => {  
    const city = req.body.city
    
    fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
    )
    .then((response) => response.json())
    .then((resJson) => { 
        console.log(resJson)
        const formData = {
            location: resJson.location.name,
            region: resJson.location.region,
            icon: resJson.current.condition.icon,
            temp: Math.round(resJson.current.temp_f), 
            condition: resJson.current.condition.text, 
            humidity: resJson.current.humidity    
        }
        return formData
    })
    .then((formData) => {
        console.log(formData)
    
        res.render('weatherres', formData)       
    })
    
    .catch((err) => console.log(err)) 

})

app.listen(3000)

//IMPORT NODE-FETCH
//NEED TO CREATE A FETCH REQUEST-STRING INTERPOLATE CITY INTO THE URL
//PARSE THE RESPONSE

