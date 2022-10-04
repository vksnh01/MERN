const dotenv = require('dotenv')
const env = dotenv.config({path:'./config.env'})
const mongoose  = require('mongoose')
const DATABASE = process.env.DATABASE

mongoose.connect(DATABASE).then(()=>{
    console.log("MonogoDB Connect with Project")
}).catch(()=>{
    console.log("MonogoDB Connectino Failled")
})