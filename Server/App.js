const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const bcrypt = require('bcrypt');
const saltRounds = 10;

//dataBase Connection
try {
    mongoose.connect("mongodb://localhost:27017/userLogin")
    .then(()=>{
        console.log("Database is connected");
    })
    .catch((error)=>{
        console.log(error.message);
    }) 
} catch (error) {
    console.log(error.message);
}


//database schema
const dataBaseSchema = mongoose.Schema({
    email:{
        type:String,
        require
    },
    password:{
        type:String,
        require
    }
})

//dataBase model
const dataModel = mongoose.model("LoginPage",dataBaseSchema);

//routes
app.post("/UserRegister",async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await dataModel.findOne({email});
            if(user){
                return res.status(201).json({
                    message : "User allready exist"
                })
            }

            bcrypt.hash(password, saltRounds, async (err, hash)=> {
                const newUser = await new dataModel({
                    email:email,
                    password:hash
                })
                await newUser.save();
                res.status(200).json({
                    message:"successfully posted",
                    email:newUser.email
                })
            });     
       
    } catch (error) {
        console.log(error.message);
    }
    
})

app.post("/UserLogin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await dataModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send({ message: "Error comparing passwords" });
            }

            if (result) {
                return res.status(200).send({ message: "Successfully Login" });
            } else {
                return res.status(401).send({ message: "Invalid credentials" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});






module.exports = app;