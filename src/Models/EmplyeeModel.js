const dotenv = require('dotenv');
const env = dotenv.config({path:'./config.env'})
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



const Employee_schema = new mongoose.Schema({
    First_Name:{type:String,required:true},
    Last_Name:{type:String,required:true},
    Email:{type:String,required:true,unique:true},
    gender:{type:String,required:true},
    Contact:{type:Number,required:true,unique:true},
    Dob:{type:String,required:true},
    Age:{type:String,required:true},
    City:{type:String,required:true},
    Password:{type:String,required:true},
    C_Password:{type:String,required:true},
    tokens:[{token:{type:String,required:true}}]
})


// Token Generate
Employee_schema.methods.generateAwthToken = async function (){
    const SECRETE_KEY = process.env.SECRET_KEY

    try{
        console.log("Token Inside")
        const token = await jwt.sign({_id:this._id.toString()},SECRETE_KEY)
       this.tokens = this.tokens.concat({token});
        console.log(token);
        // await this.save();
        return token;
    }catch(error){
        console.log(error)
    }
}

///Password Change in Bcrypt
Employee_schema.pre('save',async function(next){
    if(this.isModified('Password')){
        this.Password = await bcrypt.hash(this.Password,12);
        this.C_Password = undefined; 
    }
    
    next();
})

const Employee = new mongoose.model('Employee_Register',Employee_schema);

module.exports = Employee;