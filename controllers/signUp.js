require("dotenv").config()
const modelName = require("../models").userSign;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("fastest-validator")


const signUp = async(req,res)=>{
    try {
        const { name, email, password } = req.body;
        const checkEmail = await modelName.findOne({
            where: {email: email}
        });
        if( checkEmail ){
            res.status(400).json({
                status: "Failed",
                message: "Email already exist..."
            })
        }else{
            const saltPasswrd = await bcrypt.genSalt(10);
            const hassedPasswrd = await bcrypt.hash(password, saltPasswrd);
            const genToken = jwt.sign({
                name,
                email
            }, process.env.jwtCheck, {
                expiresIn: "1d"
            });
            
        const userData = {
            name,
            email,
            password: hassedPasswrd,
            token: genToken
        };
        const schema = {
            name: {type: "string", min: 2, optional: false},
            email: {type: "email", min: 2, optional: false},
            password: {type: "string", min: 2, optional: false},
            token: {type: "string", min: 2, optional: false},
        };
        const valid = new validator().validate(userData, schema);
        if(valid === true){
            const created = await modelName.create(userData);
            res.status(201).json({
                data: created
            })
        }else{
            res.status(400).json({
                status: "Failed",
                message: valid[0].message
            })
        }
        };

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
};



module.exports = {
    signUp
}