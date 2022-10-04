const dotenv = require("dotenv");
const env = dotenv.config({path:'./config.env'})
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./DataBase/conn");
const bcrypt = require("bcryptjs");
const Employee_Register = require("./Models/EmplyeeModel");

const port = process.env.PORT;

//Path
const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");
//Using Express Function
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

//Set Engine & register Partials
app.set("view engine", "hbs");
app.set("views", view_path);
hbs.registerPartials(partial_path);



 //index page randering
app.get("/", (req, res) => {
  res.render("index");
});
 //login page randering
app.get("/login", (req, res) => {
  res.render("login");
});
//index page randering
app.get("/Register", (req, res) => {
  res.render("Register");
}); 

// create Data of Employee
app.post("/Register", async (req, res) => {
  const {fname,lname,email,gender,contact,dob,age,city,password,confirm_password}=req.body;
  try {
    const Password = password;
    const C_Password = confirm_password;

    if (Password === C_Password) {
      const data = new Employee_Register({
        First_Name: fname,
        Last_Name: lname,
        Email: email,
        gender: gender,
        Contact: contact,
        Dob: dob,
        Age: age,
        City: city,
        Password,
        C_Password,
      });
      await data.generateAwthToken();
      await data.save();
      res.status(201).render("index");
    } else {
      res.send("Please insert all Require value");
    }
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// login check form
app.post("/login", async (req, res) => {
  try {
    const Email = req.body.email;
    const Password = req.body.password;
    const GetEmail = await Employee_Register.findOne({Email});
    const comparePassword = bcrypt.compare(Password, GetEmail.Password);

    const token =  await GetEmail.generateAwthToken();
    console.log(token)
    if (comparePassword) {
      res.send("welcome");
    } else {
      res.send("User Id Or Password Incorrect");
    }
  } catch (e) {
    res.status(400).send();
  }
});


// createJWT();


app.listen(port, () => {
  console.log(`listening Conncection Successfull on port no ${port}`);
});
